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
  const user = await accountsRepository.findUserByID(jwtPayload.id);
  if (user) done(null, user);
  else done(null, false);
});

// Tell Passport to use this strategy
passport.use(strategy);

module.exports = passport;
