import { Model, DataTypes, Sequelize } from 'sequelize'

const userStatTable = 'user_stats';

const userStatSchema = {

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
      total_words_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_posts_generated: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_post_published: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }

};

class UserStat extends Model {
  static associate(models) {
    // define association here
    this.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: userStatTable,
      modelName: 'UserStat',
      timestamps: true
    }
  }
}

export { UserStat, userStatSchema, userStatTable };