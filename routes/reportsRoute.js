const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('../helpers/passportAuthentication');

const ReportsController = require('../controllers/ReportsController');
const reportsController = new ReportsController();

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

router.get('/', (req, res) => reportsController.getAllReports(req, res));
router.get('/scoreboard/:id', (req, res) =>
  reportsController.getScoreboardReports(req, res)
);
router.get('/:id', (req, res) => reportsController.getReportById(req, res));
router.delete('/:id', (req, res) => reportsController.deleteReport(req, res));
router.put('/:id', upload.single('reportDocument'), (req, res) =>
  reportsController.updateReportById(req, res)
);
router.post('/', upload.single('reportDocument'), (req, res) =>
  reportsController.createReport(req, res)
);

module.exports = router;
