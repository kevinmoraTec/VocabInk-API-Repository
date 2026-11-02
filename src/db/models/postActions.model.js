import { Model, DataTypes, Sequelize } from 'sequelize'

const postActionsTable = 'post_actions';

const postActionsSchema = {

     id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      post_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'generated_posts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
            action_type: {
        type: DataTypes.ENUM('COPY', 'SHARE_LINKEDIN_URL'),
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

class PostActions extends Model {
  static associate(models) {
    // define association here 
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'user_id'
    });
    this.belongsTo(models.GeneratedPost, {
      as: 'generated_post',
      foreignKey: 'post_id'
    });    
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: postActionsTable,
      modelName: 'PostActions',
      timestamps: true
    }
  }
}

export { PostActions, postActionsSchema, postActionsTable };