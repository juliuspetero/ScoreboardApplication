'use strict';
module.exports = (sequelize, DataTypes) => {
  const = sequelize.define('', {
    id: DataTypes.UUID,
    name: DataTypes.STRING
  }, {});.associate = function(models) {
    // associations can be defined here
  };
  return;
};