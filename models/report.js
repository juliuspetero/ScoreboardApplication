'use strict';
const uniqid = require('uniqid');
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    'Report',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      scoreBoardId: DataTypes.UUID,
      description: DataTypes.TEXT,
      documentUrl: DataTypes.STRING
    },
    {}
  );

  Report.beforeCreate(report => (report.id = uniqid()));
  Report.associate = function(models) {
    Report.belongsTo(models.ScoreBoard, {
      foreignKey: 'scoreBoardId',
      as: 'scoreboard'
    });
  };
  return Report;
};
