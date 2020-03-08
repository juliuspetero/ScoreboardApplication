const express = require('express');
const cors = require('cors');
const path = require('path');
const { handleError, ErrorHandler } = require('./helpers/error');

// Strategized passport to handle JWT
const passport = require('./helpers/passportAuthentication');
const { sequelize, Sequelize } = require('./models');

const app = express();

// Open up opportunity for accessing profile pictures
app.use('/api/uploads', express.static(path.join(__dirname, 'assets/uploads')));

// Initialize passport with express
app.use(passport.initialize());

// Allow cross origin resource sharing
app.use(cors());

app.use(express.json());

// Check the databse connection
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Http requests flow to their respective routes
app.use('/', require('./routes/homeRoute'));
app.use('/api/accounts', require('./routes/accountsRoute'));
app.use('/api/administration', require('./routes/administrationRoute'));
app.use('/api/roles', require('./routes/rolesRoute'));
app.use('/api/users', require('./routes/usersRoute'));
app.use('/api/kpis', require('./routes/kpisRoute'));
app.use('/api/scoreboards', require('./routes/scoreBoardsRoute'));
app.use('/api/departments', require('./routes/departmentsRoute'));
app.use('/api/jobtitles', require('./routes/jobtitlesRoute'));
app.use('/api/scoreboardlayouts', require('./routes/scoreboardLayoutRoute'));

// Global Error Handling
app.use((error, req, res, next) => {
  handleError(error, res);
});

const PORT = process.env.PORT || 5000;

// sequelize.sync({force: true});

app.listen(
  PORT,
  console.log(`Server started on port @ http://localhost:${PORT}`)
);
