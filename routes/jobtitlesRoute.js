const express = require('express');
const router = express.Router();
const passport = require('../helpers/passportAuthentication');

const JobtitlesController = require('../controllers/JobtitlesController');
const jobtitlesController = new JobtitlesController();

router.get('/get-users-by-jobtitle', (req, res) =>
  jobtitlesController.getUsersByJobtitle(req, res)
);
router.get('/', (req, res) => jobtitlesController.getAllJobtitles(req, res));

router.get('/:id', (req, res) => jobtitlesController.getjobtitleById(req, res));
router.delete('/:id', (req, res) =>
  jobtitlesController.deleteJobtitleById(req, res)
);
router.put('/:id', (req, res) =>
  jobtitlesController.updateJobtitleById(req, res)
);
router.post('/', (req, res) => jobtitlesController.createJobtitle(req, res));

module.exports = router;
