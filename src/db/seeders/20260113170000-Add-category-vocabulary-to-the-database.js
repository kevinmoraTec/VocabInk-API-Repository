'use strict';

import { randomUUID } from 'crypto';

/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert('category_vocabulary', [
    {
      id: randomUUID(),
      name: 'Leadership',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      name: 'Career',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      name: 'Soft Skills',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      name: 'AI & Data',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      name: 'Productivity',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
        id: randomUUID(),
        name: 'Business',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('category_vocabulary', null, {});
}
