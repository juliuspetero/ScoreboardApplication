const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AccountsRepository = require('../repositories/AccountsRepository');
const accountsRepository = new AccountsRepository();
const secretOrKey = require('../config/config.json')['secretOrKey'];

class AccountsController {
  // This creates a new user in the database
  async register(req, res) {
    const { email, password } = req.body;
    let errors = 'There is problem';
    if (!email) errors += ', email is required';
    if (!password) errors += ', password is required';
    if (errors != 'There is problem') {
      res.status(400).json({
        message: errors
      });
    }
    // Find the user with the specified email
    let user = await accountsRepository.findUserByEmail(email);
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
    let errors = 'There is problem';
    if (!email) errors += ', email is required';
    if (!password) errors += ', password is required';
    if (errors != 'There is problem') {
      res.status(400).json({
        message: errors
      });
    }
    const user = await accountsRepository.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'No such user found' });
      return;
    }
    if (await bcrypt.compare(password, user.password)) {
      const payload = { id: user.id };
      const token = jwt.sign(payload, secretOrKey, {
        expiresIn: 3600
      });
      res.json({ token: token, email: user.email, username: user.username });
    } else res.status(401).json({ msg: 'Password is incorrect' });
  }

  // Change password
  changePassword() {
    //
  }

  // Forgot password
  recoverPassword() {
    //
  }
}

module.exports = AccountsController;
