'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('permission', 
    [
      {
        name: 'MASTER',
        description: 'MASTER',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'BRANCH_MANAGER',
        description: 'BRANCH_MANAGER',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'DEPARTMENT_MANAGER',
        description: 'DEPARTMENT_MANAGER',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'ADMIN_GROUP_USER',
        description: 'ADMIN_GROUP_USER',
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
    return queryInterface.bulkDelete('permission', null, {});
  }
};
