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
    await queryInterface.createTable('generated_posts', {
      
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
    });
  }

  export async function down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('generated_posts');

  }

