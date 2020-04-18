const passport = require('passport');

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

module.exports = authenticateUser;
