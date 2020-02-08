const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const isEmpty = require('lodash/isEmpty');
const validator = require('validator');

const AccountsRepository = require('../repositories/AccountsRepository');
const accountsRepository = new AccountsRepository();
const secretOrKey = require('../config/config.json')['secretOrKey'];

class AccountsController {
  // This creates a new user in the database
  async register(req, res) {
    const unhashedPassword = req.body.password;
    const { errors, isValid } = this.validateRegistrationInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
      return;
    }
    // Find the user with the specified email
    let user = await accountsRepository.findUserByEmail(req.body.email);
    if (user != null) {
      // Sending the response terminates a particular HTTP request
      res.status(400).send({
        message: `The user with email ${req.body.email} already exists`
      });
    } else {
      // The user is not yet taken, so encrypt the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(unhashedPassword, salt);
      req.body.password = hashedPassword;

      // Create a new user with the hashed passsword
      user = await accountsRepository.createUser(req.body);

      // Login the new user by creating and sending token
      const payload = { id: user.id };
      // The token expires after 1 hour
      const token = jwt.sign(payload, secretOrKey, {
        expiresIn: 3600
      });
      res.json({
        token: token,
        id: user.id,
        email: user.email,
        username: user.username
      });
    }
  }

  // This authenticates the user and issue JWT
  async login(req, res) {
    const { email, password } = req.body;

    // Validation for required fields
    const { errors, isValid } = this.validateLoginInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
      return;
    }

    const user = await accountsRepository.findUserByEmail(email);
    if (!user) {
      res
        .status(401)
        .json({ email: `User with email ${email} does not exist` });
      return;
    }
    if (await bcrypt.compare(password, user.password)) {
      const payload = { userInformation: user };
      const token = jwt.sign(payload, secretOrKey, {
        expiresIn: 3600
      });

      let currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 1);

      res.json({ token: token, expiresOn: currentDate.toISOString() });
    } else res.status(401).json({ password: 'Password is incorrect' });
  }

  // Change password
  changePassword() {
    //
  }

  // Forgot password
  recoverPassword() {
    //
  }

  validateLoginInput(data) {
    let errors = {};

    // Email validation
    if (data.email == null) errors.email = 'Email is required';
    else if (!validator.isEmail(data.email))
      errors.email = 'Email is not correct';

    // Password validation
    if (data.password == null) errors.password = 'Password is required';

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }

  validateRegistrationInput(data) {
    let errors = {};

    // Email validation
    if (data.email == null) errors.email = 'Email is required';
    else if (!validator.isEmail(data.email))
      errors.email = 'Email is not correct';

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

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
}

module.exports = AccountsController;
