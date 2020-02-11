const { User, Role, Department, UserRole } = require('../models');

class AccountRepository {
  // Create a single user in the database
  async createUser(user) {
    return await User.create(user);
  }

  // Find a particular user by his unique Id
  async findUserById(id) {
    return await User.findOne({ where: { id }, raw: true });
  }

  async findUserByEmailAsync(email) {
    return await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'roles',
          required: false, // Required true allows only roles with users to be displayed
          attributes: ['id', 'name'],
          through: {
            model: UserRole,
            as: 'userRoles',
            // Attribute in the userRoles which needs to be included
            attributes: []
          }
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'title']
        }
      ]
    });
  }

  // Fetch all the user in the database
  async findAllUsers() {
    return await User.findAll({ raw: true });
  }
}

module.exports = AccountRepository;
