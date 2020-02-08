const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;

const secretOrKey = require('../config/config.json')['secretOrKey'];
const AccountsRepository = require('../repositories/AccountsRepository');
const accountsRepository = new AccountsRepository();

// Options for JWT, the secretOrKey is use to authorized token decryption
const jwtOptions = {
  secretOrKey,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
};

// Create a strategy for a web token authentication i.e.
// the description on how the token should be validated and decrypted
const strategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  //  If no toke or token expired, password call done and pass in error = null, user = false and info
  // It does not execute any other code

  // This is when the token is valid
  const user = await accountsRepository.findUserById(
    jwtPayload.userInformation.id
  );

  if (user) return done(null, user);
  else return done('Error', false);
});

// Tell Passport to use this strategy
passport.use(strategy);

module.exports = passport;
