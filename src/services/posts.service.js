import {models} from '../libs/sequelize.js';
import boom from '@hapi/boom';
import sequelize from '../libs/sequelize.js';
import SystemTemplatesService from './systemTemplates.service.js';
import VocabularyService from './vocabulary.service.js';
import Users from './user.service.js';
const serviceSystemTemplates = new SystemTemplatesService();
const serviceVocabulary = new VocabularyService();
const serviceUsers = new Users();
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";   
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

class PostsService {    

    constructor() {
    }

    async getAllPosts() {
        return models.GeneratedPost.findAll();
    }

    async getPostById(id) {
        const post = await models.GeneratedPost.findByPk(id);
        if (!post) {
            throw boom.notFound('Post not found');
        }
        return post;
    }

    async getThreeLastestPostsByUserId(user_id) {
        return models.GeneratedPost.findAll({
            where: { user_id },
            limit: 3,
            order: [['createdAt', 'DESC']]  
        });
    }

        async getThreeLastestPostsPublishedByUserId(user_id) {
            return models.GeneratedPost.findAll({
                where: { 
                    user_id, 
                    status: { [sequelize.Sequelize.Op.in]: ['published', 'draft'] }
                },
                limit: 3,
                order: [['createdAt', 'DESC']]  
            });
        }


    async createPost(data) {

        let postGeneratedArray = []

        let arrayVocabulary = [];


        const template = await serviceSystemTemplates.getTemplateById(data.system_template_id);

        const dataUser = await serviceUsers.getUserById(data.user_id);

        const user_context = dataUser.profile_config.onboarding;

     
        /**
         * {"onboarding":{"appLanguage":"es","contentLanguage":"es","englishLevel":null,"role":"Software Developer","topics":["backend","cloud","career","productivity","networking","finance","education","entrepreneurship","personal-branding","leadership","devops"],"source":"LinkedIn","postFrequency":"daily"}}
         */

        // 1. Language Map for Clarity
const languageMap = {
    'es': 'Spanish',
    'pt': 'Portuguese',
    'en': 'English'
};

let systemPrompt = '';

let userPrompt = '';

// Default to the user's content language (e.g., 'es' for the Doctor in Ecuador)
const targetLanguagetoPublish = languageMap[user_context.contentLanguage] || 'English';

const appLanguageUser = languageMap[user_context.appLanguage] || 'English';



        console.log('Template:', template);
        for (let dataItem of data.vocabulary_ids) {
            const vocabItem = await serviceVocabulary.getVocabularyById(dataItem);
            console.log('Vocab Item:', vocabItem);
            arrayVocabulary.push(vocabItem.word_or_phrase);
        }


        console.log('Array Vocabulary:', arrayVocabulary);


        if (targetLanguagetoPublish == appLanguageUser){

             systemPrompt = `You are a world-class Personal Branding & LinkedIn Ghostwriter.

Your Goal: Create high-value, engaging LinkedIn content that helps the user grow their authority in ${user_context.topics?.join(', ') || 'technology'}. You should remove the friction of content creation. you must turn their ideas into high-engagement LinkedIn posts

CRITICAL INSTRUCTION ON LANGUAGE:
1. **Native Fluency:** Write strictly in **${targetLanguagetoPublish}**. The tone must be culturally natural for a native speaker of ${targetLanguagetoPublish}.
2. **High Impact:** The content must be valuable, insightful, and formatted for readability (short paragraphs, hooks).
3. **Authenticity:** Match the user's professional role (${user_context.role}).`;

 userPrompt = `
 The user wants to post using this template:
${template.ai_prompt}

IMPORTANT REQUIREMENTS:
- You MUST incorporate these words naturally: ${arrayVocabulary.join(', ')}
- The words should feel natural, not forced
- **Tone Preference:** Professional yet Accessible
- Topics of interest: ${user_context.topics?.join(', ') || 'technology'}

Generate exactly 3 different variations of this LinkedIn post.
Each variation should have a different tone or angle while using the same vocabulary words.

RESPONSE FORMAT (MUST follow exactly):
Return a JSON array with exactly 3 objects. Each object MUST have these exact field names:
- "content": (string) the full LinkedIn post text
- "tone": (string) one of "professional", "casual", or "inspiring"

Example format:
[
  {"content": "Your post text here...", "tone": "professional"},
  {"content": "Another post text...", "tone": "casual"},
  {"content": "Third post text...", "tone": "inspiring"}
]
`;

        }else if (targetLanguagetoPublish != appLanguageUser && user_context.englishLevel){ 
                     systemPrompt = `You are a LinkedIn content assistant helping a ${user_context.role || 'developer'} 
with ${user_context.englishLevel || 'intermediate'} English level create engaging posts.
The user wants to practice using specific vocabulary words naturally in professional content.`;


 userPrompt = `
 The user wants to post about this template:
${template.ai_prompt}

IMPORTANT REQUIREMENTS:
- You MUST incorporate these words naturally: ${arrayVocabulary.join(', ')}
- The words should feel natural, not forced
- Match the user's English level: ${user_context.englishLevel || 'intermediate'}
- Topics of interest: ${user_context.topics?.join(', ') || 'technology'}

Generate exactly 3 different variations of this LinkedIn post.
Each variation should have a different tone or angle while using the same vocabulary words.

RESPONSE FORMAT (MUST follow exactly):
Return a JSON array with exactly 3 objects. Each object MUST have these exact field names:
- "content": (string) the full LinkedIn post text
- "tone": (string) one of "professional", "casual", or "inspiring"

Example format:
[
  {"content": "Your post text here...", "tone": "professional"},
  {"content": "Another post text...", "tone": "casual"},
  {"content": "Third post text...", "tone": "inspiring"}
]
`;
        
  
    } 

    const LinkedInPostSchema = z.array(
    z.object({
      content: z.string().min(50).max(3000),
      tone: z.enum(["professional", "casual", "inspiring"]),
    })
  ).length(3);
  //gemini-2.5-flash-lite
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
                contents: userPrompt,
                config: {
                    systemInstruction: systemPrompt,
                    temperature: 0.8,
                    responseMimeType: "application/json",
                    responseJsonSchema: zodToJsonSchema(LinkedInPostSchema),
                }
                
        });



        const responseParsedArray = JSON.parse(response.text);

 

        if (responseParsedArray.length > 0) {
            for(let dataItem of responseParsedArray) {
                console.log('Data Item:', dataItem);
                
                // Handle both "content" and "post" field names as fallback
                let postContent = dataItem.content || dataItem.post;
                
                if (!postContent) {
                    console.error('No content found in response item:', dataItem);
                    continue;
                }

                        // Append hashtag if not already present
                     postContent += ' #Lingoloop';
                
                
                const newPost = await models.GeneratedPost.create({
                    user_id: data.user_id,
                    system_template_id: data.system_template_id,
                    content: postContent,
                    status: 'draft',
                });
    

                postGeneratedArray.push(newPost);

                if (newPost) {

                    for (let vocabId of data.vocabulary_ids) {
                        await models.PostVocabulary.create({
                            generated_post_id: newPost.id,
                            vocabulary_id: vocabId
                        });
                    }
                    
                }
                
                
                
            }
        }

        return postGeneratedArray;

}

    async updatePost(id, changes) {
        const post = await this.getPostById(id);
        const updatedPost = await post.update(changes);
        return updatedPost;
    }

    async deletePost(id) {
        console.log(`Deleting post with id: ${id}`);
        const post = await this.getPostById(id);
        await post.destroy();

        return { message: 'Post deleted successfully' };
    }
}

export default PostsService;