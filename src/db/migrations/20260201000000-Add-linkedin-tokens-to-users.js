'use strict';
import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'linkedin_access_token', {
        type: DataTypes.TEXT,
        allowNull: true,
    });

    await queryInterface.addColumn('users', 'linkedin_refresh_token', {
        type: DataTypes.TEXT,
        allowNull: true,
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'linkedin_access_token');
    await queryInterface.removeColumn('users', 'linkedin_refresh_token');
}
