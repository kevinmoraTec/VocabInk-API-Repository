import { Model, DataTypes, Sequelize } from 'sequelize'
const categoryVocabularyTable = 'category_vocabulary';

const categoryVocabularySchema = {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
};

class CategoryVocabulary extends Model {
  static associate(models) {
    this.hasMany(models.Vocabulary, {
      as: 'vocabularies',
      foreignKey: 'id_category_vocabulary'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: categoryVocabularyTable,
      modelName: 'CategoryVocabulary',
      timestamps: true
    }
  }
}

export { CategoryVocabulary, categoryVocabularySchema, categoryVocabularyTable }