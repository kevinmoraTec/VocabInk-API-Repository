import {models} from '../libs/sequelize.js';
import boom from '@hapi/boom';
import sequelize from '../libs/sequelize.js';

class VocabularyService {
  constructor() {
  }

  async getAllVocabulary() {
    return models.Vocabulary.findAll();
  }

  async getVocabularyById(id) {
    const vocabulary = await models.Vocabulary.findByPk(id);
    if (!vocabulary) {
      throw boom.notFound('Vocabulary not found');
    }
    return vocabulary;
  }

  async getAllVocabularyById(id) {
    const vocabularies = await models.Vocabulary.findAll({ where: { user_id: id } });
    return vocabularies;
  }

  async createVocabulary(vocabulary) {
    try {
      const [newVocabulary, created] = await models.Vocabulary.findOrCreate({ 
        where: 
        { word_or_phrase: vocabulary.word_or_phrase },
        defaults: vocabulary
      });
      return newVocabulary;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateVocabulary(id, updatedInfo) {
    const vocabulary = await models.Vocabulary.findByPk(id);
    if (!vocabulary) {
      throw boom.notFound('Vocabulary not found');
    }
    return vocabulary.update(updatedInfo);
  }

  async deleteVocabulary(id) {
    const vocabulary = await models.Vocabulary.findByPk(id);
    if (vocabulary) {
      await vocabulary.destroy();
      return { message: 'Vocabulary deleted successfully' };
    }
    throw boom.notFound('Vocabulary not found');
  }
}

export default VocabularyService;