const express = require('express');
const router = express.Router();
const passport = require('../helpers/passportAuthentication');

const ScoreboardLayoutsController = require('../controllers/ScoreboardLayoutsController');
const scoreboardLayoutsController = new ScoreboardLayoutsController();

router.get('/', (req, res) =>
  scoreboardLayoutsController.getAllscoreboardLayouts(req, res)
);

router.get('/get-user-scoreboardlayout', (req, res) =>
  scoreboardLayoutsController.getUserScoreboardLayout(req, res)
);
router.get('/:id', (req, res) =>
  scoreboardLayoutsController.getScoreboardLayoutById(req, res)
);

router.delete('/:id', (req, res) =>
  scoreboardLayoutsController.deleteScoreboardLayoutById(req, res)
);

router.put('/edit-kpi-weights', (req, res) =>
  scoreboardLayoutsController.editKPIWeights(req, res)
);

router.put('/:id', (req, res) =>
  scoreboardLayoutsController.updateScoreboardLayoutById(req, res)
);
router.post('/', (req, res) =>
  scoreboardLayoutsController.createScoreboardLayout(req, res)
);

module.exports = router;
