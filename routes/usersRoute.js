const express = require('express');
const router = express.Router();
const multer = require('multer');

const passport = require('../helpers/passportAuthentication');
const UsersController = require('../controllers/UsersController');
const usersController = new UsersController();

// Uploading File
const DIR = './assets/uploads';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, DIR);
  },
  filename: (req, file, callback) => {
    callback(null, `${new Date().getTime().toString(36)}_${file.originalname}`);
  }
});
const upload = multer({ storage });

//passport.authenticate('jwt', { session: false }),
router.get('/search', (req, res) =>
  usersController.getAllUsersByTerm(req, res)
);
router.get('/', (req, res) => usersController.getAllUsers(req, res));
router.get('/:id', (req, res) => usersController.getUserById(req, res));
router.delete('/:id', (req, res) => usersController.deleteUserById(req, res));

// An employee can update their profile and upload photo as well
router.put('/:id', upload.single('profilePhoto'), (req, res) =>
  usersController.updateUserById(req, res)
);

router.post('/', (req, res) => usersController.createUser(req, res));
router.get('/user-roles', (req, res) =>
  usersController.getRolesOfUser(req, res)
);

module.exports = router;
