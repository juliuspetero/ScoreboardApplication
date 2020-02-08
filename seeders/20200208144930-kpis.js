'use strict';
const uniqid = require('uniqid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'KPIs',
      [
        {
          id: uniqid(),
          title: 'KPI One',
          description: 'KPI One Description'
        },
        {
          id: uniqid(),
          title: 'KPI One',
          description: 'KPI One Description'
        },
        {
          id: uniqid(),
          title: 'KPI Two',
          description: 'KPI Two Description'
        },
        {
          id: uniqid(),
          title: 'KPI Three',
          description: 'KPI Three Description'
        },
        {
          id: uniqid(),
          title: 'KPI Four',
          description: 'KPI Four Description'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('KPIs', null, {});
  }
};
