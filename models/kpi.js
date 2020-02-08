'use strict';
const uniqid = require('uniqid');
module.exports = (sequelize, DataTypes) => {
  const KPI = sequelize.define(
    'KPI',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID
      },
      title: DataTypes.STRING,
      description: DataTypes.TEXT
    },
    {}
  );

  KPI.associate = function(models) {
    KPI.belongsToMany(models.ScoreBoard, {
      through: 'KPIScoreboards',
      foreignKey: 'KPIId',
      as: 'scoreBoards'
    });
  };

  KPI.beforeCreate(kpi => (kpi.id = uniqid()));

  return KPI;
};
