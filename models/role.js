'use strict';
const uniqid = require('uniqid');

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      name: DataTypes.STRING
    },
    {}
  );

  Role.associate = function(models) {
    Role.belongsToMany(models.User, {
      through: models.UserRole,
      as: 'users',
      foreignKey: 'roleId',
      otherKey: 'userId'
    });
  };

  // Generate a unique string Id to uniqely identify each user
  Role.beforeCreate(role => (role.id = uniqid()));
  return Role;
};
