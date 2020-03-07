'use strict';
const uniqid = require('uniqid');
module.exports = (sequelize, DataTypes) => {
  const Jobtitle = sequelize.define(
    'Jobtitle',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      title: DataTypes.STRING,
      departmentId: DataTypes.UUID
    },
    {}
  );

  Jobtitle.beforeCreate(jobtitle => (jobtitle.id = uniqid()));

  Jobtitle.associate = function(models) {
    Jobtitle.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });

    Jobtitle.hasOne(models.ScoreboardLayout, {
      foreignKey: 'jobtitleId',
      as: 'scoreboardLayout'
    });
  };
  return Jobtitle;
};
