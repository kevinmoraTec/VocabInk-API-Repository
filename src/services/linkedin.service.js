import Users from './user.service.js';

const userService = new Users();

class LinkedinService {
    
    /**
     * Share a text post on LinkedIn
     * @param {string} userId - User ID
     * @param {string} text - The text content to share
     * @returns {Promise<object>} - LinkedIn API response
     */
    async shareTextPost(userId, text) {
        const user = await userService.getUserById(userId);
        
        if (!user.linkedin_access_token) {
            throw new Error('User has not connected their LinkedIn account');
        }
        
        if (!user.linked_in_id) {
            throw new Error('LinkedIn ID not found for user');
        }

        const postData = {
            author: `urn:li:person:${user.linked_in_id}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: text
                    },
                    shareMediaCategory: 'NONE'
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.linkedin_access_token}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('LinkedIn API Error:', errorData);
            throw new Error(`Failed to share on LinkedIn: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        return result;
    }

    /**
     * Share a post with an article/link on LinkedIn
     * @param {string} userId - User ID
     * @param {string} text - The text content
     * @param {object} article - Article details { url, title, description }
     * @returns {Promise<object>} - LinkedIn API response
     */
    async shareArticlePost(userId, text, article) {
        const user = await userService.getUserById(userId);
        
        if (!user.linkedin_access_token) {
            throw new Error('User has not connected their LinkedIn account');
        }

        const postData = {
            author: `urn:li:person:${user.linked_in_id}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: text
                    },
                    shareMediaCategory: 'ARTICLE',
                    media: [
                        {
                            status: 'READY',
                            originalUrl: article.url,
                            title: {
                                text: article.title || ''
                            },
                            description: {
                                text: article.description || ''
                            }
                        }
                    ]
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.linkedin_access_token}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('LinkedIn API Error:', errorData);
            throw new Error(`Failed to share on LinkedIn: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    }

    /**
     * Share a post with an image on LinkedIn
     * @param {string} userId - User ID
     * @param {string} text - The text content
     * @param {Buffer} imageBuffer - Image file buffer
     * @param {string} mimeType - Image mime type (e.g., 'image/png', 'image/jpeg')
     * @param {string} imageAltText - Alt text for the image
     * @returns {Promise<object>} - LinkedIn API response
     */
    async shareImagePost(userId, text, imageBuffer, mimeType = 'image/png', imageAltText = '') {
        const user = await userService.getUserById(userId);
        
        if (!user.linkedin_access_token) {
            throw new Error('User has not connected their LinkedIn account');
        }

        // Step 1: Register the image upload
        const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.linkedin_access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                registerUploadRequest: {
                    recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                    owner: `urn:li:person:${user.linked_in_id}`,
                    serviceRelationships: [
                        {
                            relationshipType: 'OWNER',
                            identifier: 'urn:li:userGeneratedContent'
                        }
                    ]
                }
            })
        });

        if (!registerResponse.ok) {
            const errorData = await registerResponse.json().catch(() => ({}));
            throw new Error(`Failed to register image upload: ${JSON.stringify(errorData)}`);
        }

        const registerData = await registerResponse.json();
        const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        const asset = registerData.value.asset;

        // Step 2: Upload the image
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${user.linkedin_access_token}`,
                'Content-Type': mimeType
            },
            body: imageBuffer
        });

        if (!uploadResponse.ok) {
            throw new Error(`Failed to upload image: ${uploadResponse.status}`);
        }

        // Step 3: Create the post with the image
        const postData = {
            author: `urn:li:person:${user.linked_in_id}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: text
                    },
                    shareMediaCategory: 'IMAGE',
                    media: [
                        {
                            status: 'READY',
                            media: asset,
                            title: {
                                text: imageAltText
                            }
                        }
                    ]
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.linkedin_access_token}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to share on LinkedIn: ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    }

    /**
     * Share a post with a video on LinkedIn
     * @param {string} userId - User ID
     * @param {string} text - The text content
     * @param {Buffer} videoBuffer - Video file buffer
     * @param {string} mimeType - Video mime type (e.g., 'video/mp4')
     * @param {string} videoTitle - Title for the video
     * @returns {Promise<object>} - LinkedIn API response
     */
    async shareVideoPost(userId, text, videoBuffer, mimeType = 'video/mp4', videoTitle = '') {
        const user = await userService.getUserById(userId);
        
        if (!user.linkedin_access_token) {
            throw new Error('User has not connected their LinkedIn account');
        }

        const fileSize = videoBuffer.length;

        // Step 1: Register the video upload
        const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.linkedin_access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                registerUploadRequest: {
                    recipes: ['urn:li:digitalmediaRecipe:feedshare-video'],
                    owner: `urn:li:person:${user.linked_in_id}`,
                    serviceRelationships: [
                        {
                            relationshipType: 'OWNER',
                            identifier: 'urn:li:userGeneratedContent'
                        }
                    ],
                    supportedUploadMechanism: ['SYNCHRONOUS_UPLOAD']
                }
            })
        });

        if (!registerResponse.ok) {
            const errorData = await registerResponse.json().catch(() => ({}));
            console.error('Register video error:', errorData);
            throw new Error(`Failed to register video upload: ${JSON.stringify(errorData)}`);
        }

        const registerData = await registerResponse.json();
        const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        const asset = registerData.value.asset;

        // Step 2: Upload the video
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${user.linkedin_access_token}`,
                'Content-Type': mimeType,
                'Content-Length': fileSize.toString()
            },
            body: videoBuffer
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text().catch(() => '');
            throw new Error(`Failed to upload video: ${uploadResponse.status} - ${errorText}`);
        }

        // Step 3: Wait for video processing (optional polling)
        await this._waitForAssetProcessing(user.linkedin_access_token, asset);

        // Step 4: Create the post with the video
        const postData = {
            author: `urn:li:person:${user.linked_in_id}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: text
                    },
                    shareMediaCategory: 'VIDEO',
                    media: [
                        {
                            status: 'READY',
                            media: asset,
                            title: {
                                text: videoTitle
                            }
                        }
                    ]
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.linkedin_access_token}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to share video on LinkedIn: ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    }

    /**
     * Share a post with multiple images on LinkedIn
     * @param {string} userId - User ID
     * @param {string} text - The text content
     * @param {Array<{buffer: Buffer, mimeType: string, altText: string}>} images - Array of image objects
     * @returns {Promise<object>} - LinkedIn API response
     */
    async shareMultiImagePost(userId, text, images) {
        const user = await userService.getUserById(userId);
        
        if (!user.linkedin_access_token) {
            throw new Error('User has not connected their LinkedIn account');
        }

        if (images.length > 9) {
            throw new Error('LinkedIn allows a maximum of 9 images per post');
        }

        const mediaAssets = [];

        // Upload each image
        for (const image of images) {
            // Register upload
            const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.linkedin_access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    registerUploadRequest: {
                        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                        owner: `urn:li:person:${user.linked_in_id}`,
                        serviceRelationships: [
                            {
                                relationshipType: 'OWNER',
                                identifier: 'urn:li:userGeneratedContent'
                            }
                        ]
                    }
                })
            });

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json().catch(() => ({}));
                throw new Error(`Failed to register image upload: ${JSON.stringify(errorData)}`);
            }

            const registerData = await registerResponse.json();
            const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
            const asset = registerData.value.asset;

            // Upload image
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.linkedin_access_token}`,
                    'Content-Type': image.mimeType || 'image/png'
                },
                body: image.buffer
            });

            if (!uploadResponse.ok) {
                throw new Error(`Failed to upload image: ${uploadResponse.status}`);
            }

            mediaAssets.push({
                status: 'READY',
                media: asset,
                title: {
                    text: image.altText || ''
                }
            });
        }

        // Create the post with multiple images
        const postData = {
            author: `urn:li:person:${user.linked_in_id}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: text
                    },
                    shareMediaCategory: 'IMAGE',
                    media: mediaAssets
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.linkedin_access_token}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to share on LinkedIn: ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    }

    /**
     * Wait for asset processing to complete (for videos)
     * @private
     */
    async _waitForAssetProcessing(accessToken, asset, maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            const response = await fetch(`https://api.linkedin.com/v2/assets/${encodeURIComponent(asset)}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const status = data.recipes?.[0]?.status;
                
                if (status === 'AVAILABLE') {
                    return true;
                }
                
                if (status === 'PROCESSING') {
                    // Wait 2 seconds before checking again
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                }
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Continue anyway - LinkedIn might process it
        return true;
    }

    /**
     * Get user's LinkedIn profile info
     * @param {string} userId - User ID
     * @returns {Promise<object>} - LinkedIn profile data
     */
    async getProfile(userId) {
        const user = await userService.getUserById(userId);
        
        if (!user.linkedin_access_token) {
            throw new Error('User has not connected their LinkedIn account');
        }

        const response = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${user.linkedin_access_token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to get LinkedIn profile: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Check if the user's LinkedIn token is still valid
     * @param {string} userId - User ID
     * @returns {Promise<boolean>} - Token validity
     */
    async isTokenValid(userId) {
        try {
            await this.getProfile(userId);
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default LinkedinService;
