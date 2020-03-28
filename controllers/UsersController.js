const bcrypt = require('bcryptjs');
const validator = require('validator');
const isEmpty = require('lodash/isEmpty');
const { Op } = require('sequelize');
const cloneDeep = require('lodash/cloneDeep');
const fs = require('fs');

const {
  UserRole,
  User,
  Department,
  Role,
  ScoreBoard,
  KPIScoreBoard,
  Jobtitle
} = require('../models');

const UsersRepository = require('../repositories/UsersRepository');
const usersRepository = new UsersRepository();
const ScoreBoardsRepository = require('../repositories/ScoreBoardsRepository');
const scoreBoardsRepository = new ScoreBoardsRepository();

class UsersController {
  async getAllUsers(req, res) {
    const users = await usersRepository.findAllUsersAsync();
    res.status(200).json(users);
  }

  // Search for users by thier user names
  async getAllUsersByTerm(req, res) {
    const { query } = req.query;
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: '%' + query + '%' } },
          { email: { [Op.like]: '%' + query + '%' } }
        ]
      },
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
        },
        {
          model: Jobtitle,
          as: 'jobtitle',
          attributes: ['id', 'title']
        }
      ]
    });
    res.json(users);
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
    const unhashedPassword = req.body.password;
    const { errors, isValid } = this.validateInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
      return;
    }

    let user = await usersRepository.findUserByEmailAsync(req.body.email);

    if (user != null) {
      // Sending the response terminates a particular HTTP request
      res.status(400).send({
        message: `The user with email ${req.body.email} already exists`
      });
    } else {
      // The user is not yet taken, so encrypt the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;

      // Create a new user with the hashed passsword
      user = await usersRepository.createUserAsync(req.body);

      // Add user with the Id to a role by saving UserRole to the Database
      const roleId = req.body.roles[0];
      const userId = user.dataValues.id;

      await UserRole.create({ roleId, userId });

      res.status(201).json({
        message: `User with email ${req.body.email} has been created successfully`,
        password: unhashedPassword
      });
    }
  }

  async deleteUserById(req, res) {
    const user = await usersRepository.findUserByIdAsync(req.params.id);
    if (user !== null) {
      // Delete User
      await usersRepository.removeUserByIdAsync(req.params.id);

      // Delete profile photo
      await fs.unlink(`./assets/uploads/${user.photoUrl}`, error => {
        if (error) console.log(error);
      });

      // Delete all his scoreboards
      const scoreboards = await scoreBoardsRepository.findScoreBoardsByUserId(
        req.params.id
      );

      scoreboards.forEach(async sb => {
        await KPIScoreBoard.destroy({ where: { scoreBoardId: sb.id } });
      });
      await ScoreBoard.destroy({ where: { userId: req.params.id } });

      res.status(200).json({
        message: `User with ID = ${req.params.id} has been successfully deleted`
      });
    } else {
      res.status(404).json({
        message: `User with ID = ${req.params.id} is not found!`
      });
    }
  }

  async updateUserById(req, res) {
    // Validate parameter
    const { errors, isValid } = this.validateEditEmployee(cloneDeep(req.body));

    const user = await usersRepository.findUserByIdAsync(req.params.id);
    if (user != null) {
      if (!isValid) {
        res.status(400).json(errors);
        return;
      }

      // Check for the password presence
      if (req.body.password !== undefined) {
        // Perform hashing and delete that password
        // The user is not yet taken, so encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
      }

      if (req.file) {
        // Query the database to get the previous photo URL
        fs.unlink(`./assets/uploads/${user.photoUrl}`, error => {
          if (error) console.log(error);
        });

        // Add the photoUrl property to be saved to the database
        req.body.photoUrl = req.file.filename;
      }

      // Update the user data
      await usersRepository.updateUserAsync(req.body, req.params.id);

      // Check and update role
      if (req.body.roles !== undefined) {
        // Add user with the Id to a role by saving UserRole to the Database
        // In case of many roles use a loop the roles to the database
        const roleId = req.body.roles[0];
        await UserRole.update({ roleId }, { where: { userId: req.params.id } });
      }

      // Response back with that password
      let response = {
        message: `User with ID = ${req.params.id} has been successfully updated`
      };

      if (req.body.passwordConfirmation !== undefined)
        response.password = req.body.passwordConfirmation;
      res.status(200).json(response);
    } else {
      res.status(404).json({
        message: `User with ID = ${req.params.id} is not found!`
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

  // Validate edition of employee data
  validateEditEmployee(data) {
    let errors = {};

    // Email validation
    if (data.email !== undefined) {
      if (data.email == '') errors.email = 'Email is required';
      else if (!validator.isEmail(data.email))
        errors.email = 'Email is not correct';
    }

    // Phone number validation
    if (data.phoneNumber !== undefined) {
      if (data.phoneNumber.length < 8 || data.phoneNumber == '')
        errors.phoneNumber = 'Phone is required and should be valid';
    }

    // Employee Type
    if (data.employeeType !== undefined) {
      if (data.employeeType == '')
        errors.employeeType = 'Emplyee Type is required';
    }

    // Department
    if (data.departmentId !== undefined) {
      if (data.depart == '') errors.employeeType = 'Department is required';
    }

    // Job title
    if (data.jobtitleId !== undefined) {
      if (data.jobtitleId == '') errors.jobtitle = 'Job title is required';
    }

    // Job Description
    if (data.jobDescription !== undefined) {
      if (data.jobDescription == '')
        errors.jobDescription = 'Job Description is required';
    }

    if (data.username !== undefined) {
      if (data.username == '') errors.username = 'User Name is required';
    }

    // Password validation
    if (data.password !== undefined) {
      if (data.password.length < 4)
        errors.password = 'Password must be greater 3 characters';
      if (data.passwordConfirmation == null)
        errors.passwordConfirmation = 'Password Confirmation is required';
      if (
        data.password != undefined &&
        data.passwordConfirmation != undefined &&
        !validator.equals(data.password, data.passwordConfirmation)
      )
        errors.passwordConfirmation = 'Passwords must match';
    }

    // Check for department selection
    if (data.departmentId !== undefined) {
      if (data.departmentId == '')
        errors.department = 'DepartmentId is required';
    }

    // Check for the roles validation
    if (data.roles !== undefined) {
      if (!Array.isArray(data.roles)) errors.roles = 'Roles should be an array';
      else if (Array.isArray(data.roles)) {
        if (data.roles.length == 0)
          errors.roles = 'Roles cannot be an empty array';
        data.roles.forEach(role => {
          if (role === '') errors.roles = 'A role cannot not be empty';
        });
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }

  validateInput(data) {
    let errors = {};

    // Email validation
    if (data.email == null) errors.email = 'Email is required';
    else if (!validator.isEmail(data.email))
      errors.email = 'Email is not correct';

    // Phone number validation
    if (data.phoneNumber == null || data.phoneNumber.length < 8)
      errors.phoneNumber = 'Phone is required and should be valid';

    // Employee Type
    if (data.employeeType == null || data.employeeType == '')
      errors.employeeType = 'Emplyee Type is required';
    if (data.departmentId == null || data.departmentId == '')
      errors.department = 'Department is required';

    // Job title
    if (data.jobtitleId == null || data.jobtitleId == '')
      errors.jobtitle = 'Job title is required';

    // Job Description
    if (data.jobDescription == null || data.jobDescription == '')
      errors.jobDescription = 'Job Description is required';

    if (data.username == null || data.username == '')
      errors.username = 'User Name is required';

    // Password validation
    if (data.password == null) errors.password = 'Password is required';
    else if (data.password.length < 4)
      errors.password = 'Password must be greater 3 characters';
    if (data.passwordConfirmation == null)
      errors.passwordConfirmation = 'Password Confirmation is required';
    if (
      data.password != null &&
      data.passwordConfirmation != null &&
      !validator.equals(data.password, data.passwordConfirmation)
    )
      errors.passwordConfirmation = 'Passwords must match';

    // Check for department selection
    if (data.departmentId == null)
      errors.department = 'DepartmentId is required';

    // Check for the roles validation
    if (data.roles == null) errors.roles = 'Roles are required';
    else if (!Array.isArray(data.roles))
      errors.roles = 'Roles should be an array';
    else if (Array.isArray(data.roles)) {
      if (data.roles.length == 0)
        errors.roles = 'Roles cannot be an empty array';
      data.roles.forEach(role => {
        if (role === '') errors.roles = 'A role cannot not be empty';
      });
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
}

module.exports = UsersController;
