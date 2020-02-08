'use strict';
const uniqid = require('uniqid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Departments',
      [
        {
          id: uniqid(),
          title: 'Finance and Administration'
        },
        {
          id: uniqid(),
          title: 'Sales and Marketing'
        },
        {
          id: uniqid(),
          title: 'Finance and Administration'
        },
        {
          id: uniqid(),
          title: 'Help Desk'
        },
        {
          id: uniqid(),
          title: 'Client Relations MGT'
        },
        {
          id: uniqid(),
          title: 'Top Management'
        },
        {
          id: uniqid(),
          title: 'CSO Technicians'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Departments', null, {});
  }
};
