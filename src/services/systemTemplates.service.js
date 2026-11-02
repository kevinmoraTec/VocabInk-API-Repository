import {models} from '../libs/sequelize.js';
import boom from '@hapi/boom';
import sequelize from '../libs/sequelize.js';


class SystemTemplatesService {
  constructor() {
  }

  async getAllTemplates() {
    return models.SystemTemplate.findAll();
  }

  async getTemplateById(id) {
    const template = await models.SystemTemplate.findByPk(id);
    if (!template) {
      throw boom.notFound('System Template not found');
    }
    return template;
  }     

  async createTemplate(data) {
    const [newTemplate, created] = await models.SystemTemplate.findOrCreate({
      where: { name: data.name },
      defaults: data
    });
    return newTemplate;
  }

  async updateTemplate(id, changes) {
    const template = await this.getTemplateById(id);
    const updatedTemplate = await template.update(changes);
    return updatedTemplate;
  }
}

export default SystemTemplatesService;