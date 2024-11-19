'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Renaming the 'option' column to 'pollOption' in the 'Polls' table
    await queryInterface.renameColumn('Polls', 'option', 'pollOption');
  },

  async down (queryInterface, Sequelize) {
    // Reverting the column name change in case we want to rollback the migration
    await queryInterface.renameColumn('Polls', 'pollOption', 'option');
  }
};
