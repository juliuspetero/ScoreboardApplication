'use strict';
const uniqid = require('uniqid');

module.exports = (sequelize, DataTypes) => {
  const ScoreboardLayout = sequelize.define(
    'ScoreboardLayout',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID
      },
      userId: DataTypes.UUID
    },
    {}
  );
  ScoreboardLayout.associate = function(models) {
    ScoreboardLayout.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    ScoreboardLayout.belongsToMany(models.KPI, {
      through: 'KPIScoreboardLayouts',
      foreignKey: 'scoreboardLayoutId',
      otherKey: 'KPIId',
      as: 'kpis'
    });
  };

  ScoreboardLayout.beforeCreate(sl => (sl.id = uniqid()));
  return ScoreboardLayout;
};
