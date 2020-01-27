const bcrypt = require('bcryptjs');

const UsersRepository = require('../repositories/UsersRepository');
const usersRepository = new UsersRepository();

class UsersController {
  async getAllUsers(req, res) {
    const users = await usersRepository.findAllUsersAsync();
    res.status(200).json(users);
  }
  async getUserById(req, res) {
    const user = await usersRepository.findUserByIdAsync(req.params.id);
    if (user == null)
      res
        .status(404)
        .json({ message: `User with ID = ${req.params.id} is not found!` });
    else res.status(200).json(user);
  }
  async createUser(req, res) {
    const { email, password } = req.body;

    // Validate the user's credentials
    let errors = 'There is problem';
    if (!email) errors += ', email is required';
    if (!password) errors += ', password is required';
    if (errors != 'There is problem') {
      res.status(400).json({
        message: errors
      });
    }

    // Find the user with the specified email
    let user = await usersRepository.findUserByEmailAsync(email);
    if (user != null) {
      // Sending the response terminates a particular HTTP request
      res.status(400).send({
        message: `The user with email ${email} already exists`
      });
    } else {
      // The user is not yet taken, so encrypt the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;

      // Create a new user with the hashed passsword
      user = await usersRepository.createUserAsync(req.body);
      res.status(201).json({
        message: `User with email ${email} has been created successfully`,
        password
      });
    }
  }

  async deleteUserById(req, res) {
    const user = await usersRepository.findUserByIdAsync(req.params.id);
    if (user != null) {
      // Delete the role
      await usersRepository.removeUserByIdAsync(req.params.id);
      res.status(200).json({
        message: `User with ID = ${req.params.id} is has been successfully deleted`
      });
    } else {
      res.status(404).json({
        message: `User with ID = ${req.params.id} is not found!`
      });
    }
  }

  async updateUserById(req, res) {
    const user = await usersRepository.findUserByIdAsync(req.params.id);
    if (user != null) {
      // Update the role
      await usersRepository.updateUserAsync(req.body, req.params.id);
      res.status(200).json({
        message: `User with ID = ${req.params.id} is has been successfully updated`
      });
    } else {
      res.status(404).json({
        message: `Role with ID = ${req.params.id} is not found!`
      });
    }
  }

  async getRolesOfUser(req, res) {
    const user = await usersRepository.findUserByIdAsync(req.params.id);
    if (user != null) {
      const userRoles = await usersRepository.findUserRoles(req.params.id);
      res.status(200).json(userRoles);
    } else {
      res.status(404).json({
        message: `Role with ID = ${req.params.id} is not found!`
      });
    }
  }
}

module.exports = UsersController;
