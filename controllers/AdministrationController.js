const UsersRepository = require('../repositories/UsersRepository');
const usersRepository = new UsersRepository();

const RolesRepository = require('../repositories/RolesRepository');
const rolesRepository = new RolesRepository();

const { UserRole } = require('../models');

class AdministrationController {
  async addUsersToRole(req, res) {
    const userIds = req.body.users;

    for (let index = 0; index <= req.body.users.length; index++) {
      // Terminate the loop when all the the records has been saved to the DB
      if (index > userIds.length - 1) {
        const role = await rolesRepository.findUsersInRole(req.query.roleId);
        res.status(201).json(role);
        break;
      }
      const userId = userIds[index];
      // Search for the user with given id and make sure it exists
      const user = await usersRepository.findUserByIdAsync(userId);
      if (user == null) {
        res.status(404).json({
          message: `User with ID = ${userId} is not found`
        });
        break;
      }

      // Query the DB to know if the user role exist
      let userRole = await UserRole.findOne({
        where: { userId, roleId: req.query.roleId },
        raw: true
      });

      // Check if the role has been created already
      if (userRole != null) {
        res.status(400).json({
          message: `Role with ID = ${req.query.roleId} and user with ID= ${userId} is already created`
        });
        break;
      }

      // Create a UserRole object
      userRole = {
        roleId: req.query.roleId,
        userId: userId
      };

      // Save UserRole to the Database
      await UserRole.create(userRole);
    }
  }

  // Add a list of roles to one user
  async addRolesToUser(req, res) {
    const roleIds = req.body.roles;

    for (let index = 0; index <= roleIds.length; index++) {
      // Terminate the loop when all the the records has been saved to the DB
      if (index > roleIds.length - 1) {
        const user = await usersRepository.findUserByIdAsync(req.query.userId);
        res.status(201).json(user);
        break;
      }
      const roleId = roleIds[index];
      // Search for the user with given id and make sure it exists
      const role = await rolesRepository.findRoleByIdAsync(roleId);

      // This is when the role supplied in the list is not valid
      if (role == null) {
        res.status(404).json({
          message: `Role with ID = ${roleId} is not found`
        });
        break;
      }

      // Query the DB to know if the user-role exist
      let userRole = await UserRole.findOne({
        where: { roleId, userId: req.query.userId }
      });

      // Check if the role has been created already in the database
      if (userRole != null) {
        res.status(400).json({
          message: `Role with ID = ${roleId} and user with ID= ${req.query.userId} is already created`
        });
        break;
      }

      // Create a UserRole object
      userRole = {
        userId: req.query.userId,
        roleId
      };

      // Save UserRole to the Database
      await UserRole.create(userRole);
    }

    //   await req.body.roles.forEach(async roleId => {
    //     // Search for the user with given id and make sure it exists
    //     let role = await rolesRepository.findRoleByIdAsync(roleId);
    //     if (role == null) {
    //       res.status(404).json({
    //         message: `Role with ID = ${roleId} is not found`
    //       });
    //       return;
    //     }

    //     let userRole = await UserRole.findOne({
    //       where: { userId: req.query.userId, roleId }
    //     });

    //     // Check if the role has been created already
    //     if (userRole != null) {
    //       res.status(400).json({
    //         message: `Role with ID = ${roleId} and user with ID= ${req.query.userId} is already created`
    //       });
    //       return;
    //     }
    //     // Create a UserRole object
    //     userRole = {
    //       userId: req.query.userId,
    //       roleId
    //     };

    //     // Save UserRole to the Database
    //     await UserRole.create(userRole);
    //   });

    //   const role = await rolesRepository.findUsersInRole(req.query.roleId);
    //   res.status(201).json(role);
  }
}

module.exports = AdministrationController;
