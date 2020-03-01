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
      departmentId: DataTypes.UUID,
      title: DataTypes.STRING,
      description: DataTypes.TEXT
    },
    {}
  );

  KPI.associate = function(models) {
    KPI.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });
    KPI.belongsToMany(models.ScoreBoard, {
      through: 'KPIScoreboards',
      foreignKey: 'KPIId',
      as: 'scoreBoards'
    });
    KPI.belongsToMany(models.ScoreboardLayout, {
      through: 'KPIScoreboardLayouts',
      foreignKey: 'KPIId',
      as: 'scoreBoardLayouts'
    });
  };

  KPI.beforeCreate(kpi => (kpi.id = uniqid()));

  return KPI;
};
