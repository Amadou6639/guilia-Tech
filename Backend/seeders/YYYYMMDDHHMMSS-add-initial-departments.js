'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Departments', [
      {
        name: 'Ressources Humaines',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Finance',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Informatique',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Marketing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ventes',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Departments', null, {});
  }
};
