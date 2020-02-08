const { User, Role, UserRole } = require('../models');

class RolesRepository {
  // Fetch all the roles in the database
  async findAllRolesAsync() {
    return await Role.findAll({
      include: [
        {
          model: User,
          as: 'users',
          required: false, // This queries all the users even if they don't have any roles
          attributes: ['id', 'email'],
          through: {
            model: UserRole,
            as: 'userRoles',
            attributes: []
          }
        }
      ]
    });
  }

  // Find a particular role by his unique Id
  async findRoleByIdAsync(id) {
    return await Role.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'users',
          required: false,
          attributes: ['id', 'email'],
          through: {
            model: UserRole,
            as: 'userRoles',
            attributes: []
          }
        }
      ]
    });
  }

  async createRoleAsync(name) {
    return await Role.create({ name });
  }

  async removeRoleByIdAsync(id) {
    return await Role.destroy({ where: { id }, raw: true });
  }

  async updateRoleAsync(name, id) {
    return await Role.update({ name }, { where: { id } });
  }

  async findUsersInRole(id) {
    return await Role.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'users',
          required: false,
          attributes: ['id', 'email'],
          through: {
            model: UserRole,
            as: 'userRoles',
            attributes: []
          }
        }
      ]
    });
  }
}

module.exports = RolesRepository;
