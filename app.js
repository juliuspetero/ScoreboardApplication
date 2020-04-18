const express = require('express');
const cors = require('cors');
const path = require('path');
const { handleError, ErrorHandler } = require('./helpers/error');
const authenticateUser = require('./helpers/authenticateUser');

// Strategized passport to handle JWT
const passport = require('./helpers/passportAuthentication');
const { sequelize, Sequelize } = require('./models');

const app = express();

// Initialize passport with express
app.use(passport.initialize());

// Allow cross origin resource sharing
app.use(cors());

// Open up opportunity for accessing profile pictures
app.use('/api/uploads', express.static(path.join(__dirname, 'assets/uploads')));

app.use(express.json());

// Check the databse connection
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Http requests flow to their respective routes
app.use('/', require('./routes/homeRoute'));

// This is used for login, it does need to be protected
app.use('/api/accounts', require('./routes/accountsRoute'));
app.use(
  '/api/administration',
  authenticateUser,
  require('./routes/administrationRoute')
);
app.use('/api/roles', authenticateUser, require('./routes/rolesRoute'));
app.use('/api/users', authenticateUser, require('./routes/usersRoute'));
app.use('/api/kpis', authenticateUser, require('./routes/kpisRoute'));
app.use(
  '/api/scoreboards',
  authenticateUser,
  require('./routes/scoreBoardsRoute')
);
app.use(
  '/api/departments',
  authenticateUser,
  require('./routes/departmentsRoute')
);
app.use('/api/jobtitles', authenticateUser, require('./routes/jobtitlesRoute'));
app.use(
  '/api/scoreboardlayouts',
  authenticateUser,
  require('./routes/scoreboardLayoutRoute')
);
app.use('/api/reports', authenticateUser, require('./routes/reportsRoute'));

// Global Error Handling
app.use((error, req, res, next) => {
  handleError(error, res);
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server started on port @ http://localhost:${PORT}`)
);
