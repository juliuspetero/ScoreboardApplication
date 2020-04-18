const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticateUser = require('../helpers/authenticateUser');

const HomeController = require('../controllers/HomeController');
const homeController = new HomeController();

// This is what the user see when he navigate to the landing page
router.get('/', (req, res) => homeController.index(req, res));

module.exports = router;
