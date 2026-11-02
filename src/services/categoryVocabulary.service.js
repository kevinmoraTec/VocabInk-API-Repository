import {models} from '../libs/sequelize.js';
import boom from '@hapi/boom';
import sequelize from '../libs/sequelize.js';

class CategoryVocabularyService {
  constructor() {
  }

  async getAllCategoryVocabularies() {
    return models.CategoryVocabulary.findAll();
  }

  async getCategoryVocabularyById(id) {
    const categoryVocabulary = await models.CategoryVocabulary.findByPk(id);
    if (!categoryVocabulary) {
      throw boom.notFound('Category Vocabulary not found');
    }
    return categoryVocabulary;
  }

  async createCategoryVocabulary(categoryVocabulary) {
    try {
      const [newCategoryVocabulary, created] = await models.CategoryVocabulary.findOrCreate({ 
        where: 
        { name: categoryVocabulary.name },
        defaults: categoryVocabulary
      });

      return newCategoryVocabulary;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateCategoryVocabulary(id, updatedInfo) {
    const categoryVocabulary = await models.CategoryVocabulary.findByPk(id);
    if (!categoryVocabulary) {
      throw boom.notFound('Category Vocabulary not found');
    }
    return categoryVocabulary.update(updatedInfo);
  }

  async deleteCategoryVocabulary(id) {
    const categoryVocabulary = await models.CategoryVocabulary.findByPk(id);
    if (categoryVocabulary) {
      await categoryVocabulary.destroy();
      return { message: 'Category Vocabulary deleted successfully' };
    }
    throw boom.notFound('Category Vocabulary not found');
  }
}

export default CategoryVocabularyService;