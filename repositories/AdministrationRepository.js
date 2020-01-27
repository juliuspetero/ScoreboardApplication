const { User, Role } = require('../models');

class AdministrationRepository {
  async createRoleAsync(role) {
    return await Role.create(role);
  }

  // Find a particular user by his unique Id
  async findUserByID(id) {
    return await User.findOne({ where: { id }, raw: true });
  }

  async findUserEmail(email) {
    return await User.findOne({ where: { email }, raw: true });
  }

  // Fetch all the user in the database
  async findAllUsers() {
    return await User.findAll({ raw: true });
  }
}

module.exports = AdministrationRepository;
