'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     const { INTEGER, STRING } = Sequelize;
     await queryInterface.createTable('types', {
       id: { type: INTEGER, primaryKey: true, autoIncrement: true},
       name: STRING(100),
       type: INTEGER,
       user_id: INTEGER
     });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('types');
  }
};
