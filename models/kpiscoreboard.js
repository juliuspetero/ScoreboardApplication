'use strict';
const uniqid = require('uniqid');

module.exports = (sequelize, DataTypes) => {
  const KPIScoreBoard = sequelize.define(
    'KPIScoreBoard',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID
      },
      KPIId: DataTypes.UUID,
      scoreBoardId: DataTypes.UUID,
      KPIWeight: DataTypes.DOUBLE,
      KPIScore: DataTypes.DOUBLE
    },
    {}
  );

  KPIScoreBoard.associate = function(models) {
    KPIScoreBoard.belongsTo(models.KPI, { foreignKey: 'KPIId' });
    KPIScoreBoard.belongsTo(models.ScoreBoard, { foreignKey: 'scoreBoardId' });
  };

  KPIScoreBoard.beforeCreate(kPIScoreBoard => (kPIScoreBoard.id = uniqid()));

  return KPIScoreBoard;
};
