const { User, Role, UserRole, Department } = require('../models');

class UsersRepository {
  // Fetch all the Users in the database
  async findAllUsersAsync() {
    return await User.findAll({
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

  // Find a particular User by his unique Id
  async findUserByIdAsync(id) {
    return await User.findOne({
      where: { id },
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

  async findUserByEmailAsync(email) {
    // console.log(email);
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
