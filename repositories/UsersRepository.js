const { User } = require('../models');

class UsersRepository {
  // Fetch all the Users in the database
  async findAllUsersAsync() {
    return await User.findAll({ raw: true });
  }

  // Find a particular User by his unique Id
  async findUserByIdAsync(id) {
    return await User.findOne({ where: { id }, raw: true });
  }

  async findUserByEmailAsync(email) {
    return await User.findOne({ where: { email }, raw: true });
  }

  async createUserAsync(user) {
    return await User.create(user);
  }

  async removeUserByIdAsync(id) {
    return await User.destroy({ where: { id }, raw: true });
  }

  async updateUserAsync(user, id) {
    return await User.update(user, { where: { id } });
  }

  async findUserRoles(id) {
    return await User.findOne({ where: { id }, raw: true });
  }
}

module.exports = UsersRepository;
