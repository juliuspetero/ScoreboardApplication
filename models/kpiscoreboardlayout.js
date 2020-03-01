'use strict';
const uniqid = require('uniqid');

module.exports = (sequelize, DataTypes) => {
  const KPIScoreboardLayout = sequelize.define(
    'KPIScoreboardLayout',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID
      },
      KPIId: DataTypes.UUID,
      scoreboardLayoutId: DataTypes.UUID,
      KPIWeight: DataTypes.DOUBLE
    },
    {}
  );

  KPIScoreboardLayout.associate = function(models) {
    KPIScoreboardLayout.belongsTo(models.KPI, { foreignKey: 'KPIId' });
    KPIScoreboardLayout.belongsTo(models.ScoreboardLayout, {
      foreignKey: 'scoreboardLayoutId'
    });
  };

  KPIScoreboardLayout.beforeCreate(ksl => (ksl.id = uniqid()));

  return KPIScoreboardLayout;
};
