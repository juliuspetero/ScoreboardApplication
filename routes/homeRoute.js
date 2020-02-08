const express = require('express');
const router = express.Router();
// const passport = require('../helpers/passportAuthentication');
const passport = require('passport');

const HomeController = require('../controllers/HomeController');
const homeController = new HomeController();

router.get('/', (req, res) => homeController.index(req, res));

// Passed authenticateUser in the route you would like to protect
function authenticateUser(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    // Default error = null, user = false and infor = object
    if (!user || error)
      return res.status(401).json({ message: 'The token is empty or invalid' });
    else {
      req.user = user;
      return next();
    }
  })(req, res, next);
}

module.exports = router;
