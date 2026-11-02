import {models} from '../libs/sequelize.js';
import boom from '@hapi/boom';
import sequelize from '../libs/sequelize.js';


class LandiPageService {
    constructor() {}

    async createEmailLandiPage(data) {

        const [row, created] = await models.EmailLandiPage.findOrCreate({
            where: { email: data.email },
            defaults: data
        });

        if (!created) {
            throw new boom.conflict('Email already exists');
        }       

        // Logic to save the email landing page data
        return row
    }
}

export default LandiPageService;