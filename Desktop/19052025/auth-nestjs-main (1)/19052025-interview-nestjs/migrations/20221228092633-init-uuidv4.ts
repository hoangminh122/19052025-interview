'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  },

  async down (queryInterface, Sequelize) {
  }
};
