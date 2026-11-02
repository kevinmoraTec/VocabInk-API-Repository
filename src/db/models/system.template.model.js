import { Model, DataTypes, Sequelize } from 'sequelize'
const systemTemplateTable = 'system_templates';

const systemTemplateSchema =  {

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
      structure : {
        type: DataTypes.JSON,
        allowNull: true
      },
      ai_prompt : {
        type: DataTypes.TEXT,
        allowNull: false
      },
      example_preview : {
        type: DataTypes.TEXT,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      usage_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      icon: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      description: {
        type: DataTypes.STRING(255),
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

class SystemTemplate extends Model {
    static associate(models) {
      // define association here
        SystemTemplate.hasMany(models.GeneratedPost, {
            as: 'generated_posts',
            foreignKey: 'system_template_id'
        });
    }

    static config(sequelize) {
      return {
        sequelize,
        tableName: systemTemplateTable,
        modelName: 'SystemTemplate',
        timestamps: true
      }
    }
}

export { systemTemplateTable, systemTemplateSchema, SystemTemplate }