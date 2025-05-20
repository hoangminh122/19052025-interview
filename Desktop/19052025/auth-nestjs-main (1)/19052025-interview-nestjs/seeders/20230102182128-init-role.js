'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('role', 
    [
      {
        name: 'SUPER_ADMIN',
        description: 'SUPER_ADMIN',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'PIC_ADMIN',
        description: 'PIC_ADMIN',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'USER',
        description: 'USER',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role', null, {});
  }
};
