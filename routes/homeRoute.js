const express = require('express');
const router = express.Router();
const passport = require('../helpers/passportAuthentication');

const HomeController = require('../controllers/HomeController');
const homeController = new HomeController();

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) =>
  homeController.index(req, res)
);

module.exports = router;
