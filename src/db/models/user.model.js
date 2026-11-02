import { Model, DataTypes, Sequelize } from 'sequelize'

const userTable = 'users';

const userSchema = {

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
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(150),
      allowNull: true
    },

    google_id: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: true
    },

    linked_in_id: {
      type: DataTypes.STRING(250),
      allowNull: true,
      unique: true
    },

    linkedin_access_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    linkedin_refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    profile_config: {
      type: DataTypes.JSON,
      allowNull: true
    },

    onboarding_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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

class User extends Model {
    static associate(models) {
      
      this.hasMany(models.Vocabulary, {
        as: 'vocabularies',
        foreignKey: 'user_id'
      });

      this.hasMany(models.GeneratedPost, {
        as: 'generated_posts',
        foreignKey: 'user_id'
      });

      this.hasOne(models.UserStat, {
        as: 'user_stat',
        foreignKey: 'user_id'
      });
      this.hasMany(models.Feedback, {
        as: 'feedbacks',
        foreignKey: 'user_id'
      });
      this.hasMany(models.PostActions, {
        as: 'post_actions',
        foreignKey: 'user_id'
      });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: userTable,
            modelName: 'User',
            timestamps: true
        }
    }
}

export { userTable, userSchema, User };