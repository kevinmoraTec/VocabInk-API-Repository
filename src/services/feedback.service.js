import {models} from '../libs/sequelize.js';
import boom from '@hapi/boom';
import sequelize from '../libs/sequelize.js';


class FeedbackService {
    constructor() {}

    async createFeedback(data) {

        const feedback = await models.Feedback.create(data);

        return feedback;
    }

    async getAllFeedbacks() {

     return await models.Feedback.findAll();
}   

}


export default FeedbackService;