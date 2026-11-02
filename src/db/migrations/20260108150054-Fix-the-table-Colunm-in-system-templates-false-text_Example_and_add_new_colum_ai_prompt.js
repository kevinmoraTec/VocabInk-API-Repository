'use strict';
import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */

  export async function up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('system_templates', 'ai_prompt', {
      type: DataTypes.TEXT,
      allowNull: false,
    });

    await queryInterface.addColumn('system_templates', 'description', {
      type: DataTypes.STRING(255),
      allowNull: false,
    });

    await queryInterface.changeColumn('system_templates', 'example_preview', {
      type: DataTypes.TEXT,
      allowNull: true,
    });

        await queryInterface.changeColumn('system_templates', 'structure', {
      type: DataTypes.JSON,
      allowNull: true,
    });

  
  }

  export async function down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('system_templates', 'ai_prompt');

    await queryInterface.changeColumn('system_templates', 'example_preview', {
      type: DataTypes.TEXT,
      allowNull: false,
    });

        await queryInterface.changeColumn('system_templates', 'structure', {
      type: DataTypes.JSON,
      allowNull: false,
    });


  }

