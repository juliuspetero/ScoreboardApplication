'use strict';
const uniqid = require('uniqid');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      employeeType: DataTypes.STRING,
      departmentId: DataTypes.UUID,
      jobtitleId: DataTypes.UUID,
      jobDescription: DataTypes.TEXT,
      photoUrl: DataTypes.STRING,
      sex: DataTypes.STRING,
      address: DataTypes.STRING
    },
    {}
  );

  User.associate = function(models) {
    User.hasMany(models.ScoreBoard, {
      foreignKey: 'userId',
      as: 'scoreBoards'
    });

    User.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department'
    });

    User.belongsTo(models.Jobtitle, {
      foreignKey: 'jobtitleId',
      as: 'jobtitle'
    });

    User.belongsToMany(models.Role, {
      through: models.UserRole,
      as: 'roles',
      foreignKey: 'userId',
      otherKey: 'roleId'
    });
  };

  // Generate a unique string Id to uniqely identify each user
  User.beforeCreate(user => (user.id = uniqid()));
  return User;
};
