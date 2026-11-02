import { Model, DataTypes, Sequelize } from 'sequelize'

const vocabularyTable = 'vocabulary';

const vocabularySchema = {

  id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  allowNull: false,
  primaryKey: true
},

user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

            id_category_vocabulary: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'category_vocabulary',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      word_or_phrase: {
        type: DataTypes.STRING(250),
        allowNull: false  
      },

      context_note: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      time_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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

class Vocabulary extends Model {
  static associate(models) {
    // define association here
    this.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
    this.belongsTo(models.CategoryVocabulary, { as: 'categoryVocabulary', foreignKey: 'id_category_vocabulary' });
    this.belongsToMany(models.GeneratedPost, {
      as: 'generatedPosts',
      through: models.PostVocabulary,
      foreignKey: 'vocabulary_id',
      otherKey: 'generated_post_id'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: vocabularyTable,
      modelName: 'Vocabulary',
      timestamps: true
    }
  }
}

export { Vocabulary, vocabularySchema, vocabularyTable }