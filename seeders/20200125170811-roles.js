'use strict';
const uniqid = require('uniqid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Roles',
      [
        {
          id: uniqid(),
          name: 'HRM'
        },
        {
          id: uniqid(),
          name: 'Line Manager'
        },
        {
          id: uniqid(),
          name: 'Line Stuff'
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
