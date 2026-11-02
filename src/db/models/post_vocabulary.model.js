import { Model, DataTypes, Sequelize } from 'sequelize'

const postVocabularyTable = 'post_vocabulary';

const postVocabularySchema = {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      generated_post_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'generated_posts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      vocabulary_id: {  
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'vocabulary',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

class PostVocabulary extends Model {
  static associate(models) {
    // define association here
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: postVocabularyTable,
      modelName: 'PostVocabulary',
      timestamps: true
    }
  }
}

export { PostVocabulary, postVocabularySchema, postVocabularyTable };
