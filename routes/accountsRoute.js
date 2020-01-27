const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/AccountsController');
const accountController = new AccountController();

// Maps the HTTP request to their respective controller action methods
router.post('/register', (req, res) => accountController.register(req, res));
router.post('/login', (req, res) => accountController.login(req, res));
router.post('/change-password', (req, res) =>
  accountController.changePassword(req, res)
);
router.post('/recover-password', (req, res) =>
  accountController.recoverPassword(req, res)
);

module.exports = router;
