import {models} from '../libs/sequelize.js';
import boom from '@hapi/boom';
import sequelize from '../libs/sequelize.js';


class PostActionsService {
    constructor() {}

    async createPostAction(data) {

        const postAction = await models.PostActions.create(data);

        return postAction;
    }

    async getAllPostActions() {

     return await models.PostActions.findAll();
}   

async getAllPostActionsByUserId(user_id) {
    return models.PostActions.findAll({
        where: { user_id }
    });

}
    async getAllPostActionsByPostId(post_id) {
        return models.PostActions.findAll({
            where: { post_id }
        });
    }       


}

export default PostActionsService;