import { Model, DataTypes, Sequelize } from 'sequelize'

const emailLandiPageTable = 'emails_Landi_page';

const emailLandiPageSchema = {

     id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  allowNull: false,
  primaryKey: true
},
      name: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
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

class EmailLandiPage extends Model {
    static associate(models) {
        // define association here
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: emailLandiPageTable,
            modelName: 'EmailLandiPage',
            timestamps: true
        }
    }
}

export { emailLandiPageTable, emailLandiPageSchema, EmailLandiPage };

