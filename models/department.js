'use strict';
const uniqid = require('uniqid');
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    'Department',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      title: DataTypes.STRING
    },
    {}
  );
  Department.associate = function(models) {
    Department.hasMany(models.User);
  };

  Department.beforeCreate(department => (department.id = uniqid()));
  return Department;
};
