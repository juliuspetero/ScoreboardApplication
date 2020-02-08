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
router.get('/get-users-scoreboards', (req, res) =>
  scoreBoardsController.getUsersScoreBoards(req, res)
);
router.get('/:id', (req, res) =>
  scoreBoardsController.getScoreBoadById(req, res)
);
router.get('/:id', (req, res) =>
  scoreBoardsController.getScoreBoadByUserId(req, res)
);
router.delete('/:id', (req, res) =>
  scoreBoardsController.deleteScoreBoardById(req, res)
);
router.put('/edit-kpi-scores', (req, res) =>
  scoreBoardsController.editKPIScores(req, res)
);
router.put('/:id', (req, res) =>
  scoreBoardsController.updateScoreBoardById(req, res)
);
router.post('/', (req, res) =>
  scoreBoardsController.createScoreBoard(req, res)
);

module.exports = router;
