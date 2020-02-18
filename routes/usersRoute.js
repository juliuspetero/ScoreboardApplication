const express = require('express');
const router = express.Router();
const passport = require('../helpers/passportAuthentication');

const UsersController = require('../controllers/UsersController');
const usersController = new UsersController();

//passport.authenticate('jwt', { session: false }),
router.get('/search', (req, res) =>
  usersController.getAllUsersByTerm(req, res)
);
router.get('/', (req, res) => usersController.getAllUsers(req, res));
router.get('/:id', (req, res) => usersController.getUserById(req, res));
router.delete('/:id', (req, res) => usersController.deleteUserById(req, res));
router.put('/:id', (req, res) => usersController.updateUserById(req, res));
router.post('/', (req, res) => usersController.createUser(req, res));
router.get('/user-roles', (req, res) =>
  usersController.getRolesOfUser(req, res)
);

module.exports = router;
