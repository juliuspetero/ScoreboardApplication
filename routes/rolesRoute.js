const express = require('express');
const router = express.Router();
const passport = require('../helpers/passportAuthentication');

const RolesController = require('../controllers/RolesController');
const rolesController = new RolesController();

//passport.authenticate('jwt', { session: false }),
router.get('/users-in-role', (req, res) =>
  rolesController.getUsersInRole(req, res)
);
router.get('/', (req, res) => rolesController.getAllRoles(req, res));
router.get('/:id', (req, res) => rolesController.getRoleById(req, res));
router.delete('/:id', (req, res) => rolesController.deleteRoleById(req, res));
router.put('/:id', (req, res) => rolesController.updateRoleById(req, res));
router.post('/', (req, res) => rolesController.createRole(req, res));

module.exports = router;
