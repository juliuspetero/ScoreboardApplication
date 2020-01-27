const { User } = require('../models');

class AccountRepository {
  // Create a single user in the database
  async createUser(user) {
    return await User.create(user);
  }

  // Find a particular user by his unique Id
  async findUserById(id) {
    return await User.findOne({ where: { id }, raw: true });
  }

  // Find the user and populate his roles
  async findUserById2(id) {
    return await User.findOne({
      where: { id },
      raw: true,
      include: [
        {
          model: 'Role',
          as: 'groups',
          attributes: ['id', 'name']
        }
      ]
    });
  }

  async findUserByEmail(email) {
    return await User.findOne({ where: { email }, raw: true });
  }

  // Fetch all the user in the database
  async findAllUsers() {
    return await User.findAll({ raw: true });
  }
}

module.exports = AccountRepository;
