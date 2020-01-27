const RolesRepository = require('../repositories/RolesRepository');
const rolesRepository = new RolesRepository();
const AccountsRepository = require('../repositories/AccountsRepository');
const accountsRepository = new AccountsRepository();

class RolesController {
  async getAllRoles(req, res) {
    const roles = await rolesRepository.findAllRolesAsync();
    res.status(200).json(roles);
  }
  async getRoleById(req, res) {
    const role = await rolesRepository.findRoleByIdAsync(req.params.id);
    if (role == null)
      res
        .status(404)
        .json({ message: `Role with ID = ${req.params.id} is not found!` });
    else res.status(200).json(role);
  }
  async createRole(req, res) {
    if (req.body.name == null) {
      res.status(400).json({
        message: "Role's name is required"
      });
    } else {
      const role = await rolesRepository.createRoleAsync(req.body.name);
      res.status(201).json(role);
    }
  }

  async deleteRoleById(req, res) {
    const role = await rolesRepository.findRoleByIdAsync(req.params.id);
    if (role != null) {
      // Delete the role
      await rolesRepository.removeRoleByIdAsync(req.params.id);
      res.status(200).json({
        message: `Role with ID = ${req.params.id} is has been successfully deleted`
      });
    } else {
      res.status(404).json({
        message: `Role with ID = ${req.params.id} is not found!`
      });
    }
  }

  async updateRoleById(req, res) {
    const role = await rolesRepository.findRoleByIdAsync(req.params.id);
    if (role != null) {
      // Update the role
      await rolesRepository.updateRoleAsync(req.body.name, req.params.id);
      res.status(200).json({
        message: `Role with ID = ${req.params.id} is has been successfully updated`
      });
    } else {
      res.status(404).json({
        message: `Role with ID = ${req.params.id} is not found!`
      });
    }
  }

  // Fetch a role with all its members
  async getUsersInRole(req, res) {
    const role = await rolesRepository.findRoleByIdAsync(req.query.roleId);
    if (role != null) {
      const usersInRole = await rolesRepository.findUsersInRole(role.id);
      res.status(200).json(usersInRole);
    } else {
      res.status(404).json({
        message: `Role with ID = ${req.query.roleId} is not found!`
      });
    }
  }
}

module.exports = RolesController;
