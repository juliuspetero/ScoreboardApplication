'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('KPIScoreBoards', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      // Scoreboard has many KPIs n:n
      KPIId: {
        type: Sequelize.UUID
      },
      // KPIs can be in may scoreboards n:n
      scoreBoardId: {
        type: Sequelize.UUID
      },
      KPIWeight: {
        type: Sequelize.DOUBLE
      },
      KPIScore: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('KPIScoreBoards');
  }
};
