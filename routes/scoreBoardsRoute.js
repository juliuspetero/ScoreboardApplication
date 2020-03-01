const express = require('express');
const router = express.Router();
const passport = require('../helpers/passportAuthentication');

const ScoreBoardsController = require('../controllers/ScoreBoardsController');
const scoreBoardsController = new ScoreBoardsController();

router.get('/', (req, res) =>
  scoreBoardsController.getAllScoreBoards(req, res)
);

router.get('/get-user-scoreboards', (req, res) =>
  scoreBoardsController.getUserScoreBoards(req, res)
);
router.get('/:id', (req, res) =>
  scoreBoardsController.getScoreboardById(req, res)
);

router.delete('/:id', (req, res) =>
  scoreBoardsController.deleteScoreBoardById(req, res)
);
router.put('/edit-kpi-scores', (req, res) =>
  scoreBoardsController.editKPIScores(req, res)
);

router.put('/edit-kpi-weights', (req, res) =>
  scoreBoardsController.editKPIWeights(req, res)
);

router.put('/approval/:id', (req, res) =>
  scoreBoardsController.updateScoreboardApproval(req, res)
);

router.post('/scoreboard', (req, res) =>
  scoreBoardsController.createScoreBoard(req, res)
);

router.post('/', (req, res) =>
  scoreBoardsController.createScoreBoardList(req, res)
);

module.exports = router;
