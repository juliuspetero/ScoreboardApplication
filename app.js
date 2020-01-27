const express = require('express');
const { handleError, ErrorHandler } = require('./helpers/error');
const passport = require('./helpers/passportAuthentication');
const { sequelize, Sequelize } = require('./models');

const app = express();
// Initialize passport with express
app.use(passport.initialize());

app.use(express.json());

// Check the databse connection
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// app.get('/test/:id', (req, res) => {
//   // res.send(req.params.id);
//   res.send(req.query.id);
// });

// Http requests flow to their respective routes
app.use('/', require('./routes/homeRoute'));
app.use('/api/accounts', require('./routes/accountsRoute'));
app.use('/api/administration', require('./routes/administrationRoute'));
app.use('/api/roles', require('./routes/rolesRoute'));
app.use('/api/users', require('./routes/usersRoute'));

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
