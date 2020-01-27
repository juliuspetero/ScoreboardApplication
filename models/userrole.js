'use strict';
const uniqid = require('uniqid');
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      userId: DataTypes.UUID,
      roleId: DataTypes.UUID
    },
    {}
  );
  UserRole.associate = function(models) {
    // associations can be defined here
  };

  // Generate a unique string Id to uniqely identify each user
  UserRole.beforeCreate(userRole => (userRole.id = uniqid()));

  return UserRole;
};
