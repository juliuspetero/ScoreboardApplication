'use strict';
const uniqid = require('uniqid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return queryInterface.bulkInsert(
      'Roles',
      [
        {
          id: uniqid(),
          name: 'administrator'
        },
        {
          id: uniqid(),
          name: 'manager'
        },
        {
          id: uniqid(),
          name: 'generalManager'
        },
        {
          id: uniqid(),
          name: 'employee'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    // Add reverting commands here.
    // Return a promise to correctly handle asynchronicity.

    // Example:
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
