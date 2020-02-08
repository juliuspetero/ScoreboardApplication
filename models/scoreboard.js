'use strict';
const uniqid = require('uniqid');

module.exports = (sequelize, DataTypes) => {
  const ScoreBoard = sequelize.define(
    'ScoreBoard',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID
      },
      title: DataTypes.STRING
      // userId: DataTypes.UUID
    },
    {}
  );
  ScoreBoard.associate = function(models) {
    ScoreBoard.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  ScoreBoard.associate = function(models) {
    ScoreBoard.belongsToMany(models.KPI, {
      through: 'KPIScoreboards',
      foreignKey: 'scoreBoardId',
      otherKey: 'KPIId',
      as: 'kpis'
    });
  };

  ScoreBoard.beforeCreate(scoreBoard => (scoreBoard.id = uniqid()));
  return ScoreBoard;
};
