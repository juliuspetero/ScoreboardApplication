const UsersRepository = require('../repositories/UsersRepository');
const usersRepository = new UsersRepository();

const RolesRepository = require('../repositories/RolesRepository');
const rolesRepository = new RolesRepository();

const { UserRole } = require('../models');

class AdministrationController {
  async addUsersToRole(req, res) {
    await req.body.users.forEach(async userId => {
      // Search for the user with given id and make sure it exists
      let user = await usersRepository.findUserByIdAsync(userId);
      if (user == null) {
        res.status(404).json({
          message: `User with ID = ${userId} is not found`
        });
      }

      // Create a UserRole object
      const userRole = {
        roleId: req.query.roleId,
        userId: userId
      };

      // Save UserRole to the Database
      await UserRole.create(userRole);
    });

    const role = await rolesRepository.findUsersInRole(req.query.roleId);
    res.status(201).json(role);
  }
}

module.exports = AdministrationController;
