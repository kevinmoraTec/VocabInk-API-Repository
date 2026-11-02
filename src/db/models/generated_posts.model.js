import { Model, DataTypes, Sequelize } from 'sequelize'

const generatedPostsTable = 'generated_posts';

const generatedPostsSchema = {
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
      system_template_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'system_templates',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false  
      },

      status: {
        type: DataTypes.ENUM('draft', 'scheduled', 'published'),
        allowNull: false,
        defaultValue: 'draft'
      },
      linkedin_post_id: {
        type: DataTypes.STRING(250),
        allowNull: true,
        unique: true
      },
      scheduled_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true
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

class GeneratedPost extends Model {

    static associate(models) {
        // define association here
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id'
        });

        this.belongsTo(models.SystemTemplate, {
            as: 'system_template',
            foreignKey: 'system_template_id'
        });

        this.belongsToMany(models.Vocabulary, {
            as: 'vocabularies',
            through: models.PostVocabulary,
            foreignKey: 'generated_post_id',
            otherKey: 'vocabulary_id'
        });

        this.hasMany(models.PostActions, {
            as: 'post_actions',
            foreignKey: 'post_id'
        });
    }
    static config(sequelize) {
        return {
            sequelize,
            tableName: generatedPostsTable,
            modelName: 'GeneratedPost',
            timestamps: true
        }
    }
}

export { GeneratedPost, generatedPostsSchema, generatedPostsTable };