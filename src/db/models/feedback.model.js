import { Model, DataTypes, Sequelize } from 'sequelize'

const feedbackTable = 'feedback';

const feedbackSchema = {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      type: {
        type: DataTypes.ENUM('bug', 'feature', 'general'),
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userEmail: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      userName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      current_page: {
        type: DataTypes.STRING(200),
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

class Feedback extends Model {
  static associate(models) {
    // define association here
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: feedbackTable,
      modelName: 'Feedback',
      timestamps: true
    }
  }
}

export { feedbackSchema, Feedback, feedbackTable };