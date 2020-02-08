const isEmpty = require('lodash/isEmpty');
const isArray = require('lodash/isArray');
const cloneDeep = require('lodash/cloneDeep');

const ScoreBoardsRepository = require('../repositories/ScoreBoardsRepository');
const scoreBoardsRepository = new ScoreBoardsRepository();
const KpisRepository = require('../repositories/KpisRepository');
const kpisRepository = new KpisRepository();
const AccountsRepository = require('../repositories/AccountsRepository');
const accountsRepository = new AccountsRepository();

const { KPIScoreBoard } = require('../models');

class ScoreBoardsController {
  async getAllScoreBoards(req, res) {
    const scoreboards = await scoreBoardsRepository.findAllScoreBoardsAsync();
    res.status(200).json(scoreboards);
  }
  async getScoreBoardById(req, res) {
    const scoreBoard = await scoreBoardsRepository.findScoreBoardByIdAsync(
      req.params.id
    );
    if (scoreBoard == null)
      res.status(404).json({
        message: `ScoreBoard with ID = ${req.params.id} is not found!`
      });
    else res.status(200).json(role);
  }
  async createScoreBoard(req, res) {
    const input = cloneDeep(req.body);
    const { errors, isValid } = this.validateCreateScoreBoardInput(input);
    if (!isValid) {
      res.status(400).json(errors);
      return;
    }

    const KPIIds = req.body.KPIIds;
    const KPIWeights = req.body.KPIWeights;
    const userId = req.body.userId;
    const title = req.body.title;

    // Insert the userId and title into scoreboards table
    let scoreBoard = await scoreBoardsRepository.createScoreBoardAsync({
      title,
      userId
    });

    // Insert the KPIs for this scoreBoard
    for (let index = 0; index <= KPIIds.length; index++) {
      // Terminate the loop when all the the records has been saved to the DB
      if (index > KPIIds.length - 1) {
        scoreBoard = await scoreBoardsRepository.findScoreBoardByIdAsync(
          scoreBoard.dataValues.id
        );
        res.status(201).json(scoreBoard);
        break;
      }

      // Search for the KPI with given id and make sure it exists
      const KPI = await kpisRepository.findKPIByIdAsync(KPIIds[index]);

      if (KPI == null) {
        res.status(404).json({
          message: `KPI with ID = ${KPIIds[index]} is not found`
        });
        break;
      }

      // Create a KPIScoreboard object
      const kPIScoreBoard = {
        KPIId: KPIIds[index],
        scoreBoardId: scoreBoard.dataValues.id,
        KPIWeight: KPIWeights[index]
      };

      // Save KPIScoreboard to the DB
      await KPIScoreBoard.create(kPIScoreBoard);
    }
  }

  async deleteScoreBoardById(req, res) {
    const scoreBoard = await scoreBoardsRepository.findScoreBoardByIdAsync(
      req.params.id
    );
    if (scoreBoard != null) {
      // Delete the role
      await scoreBoardsRepository.removeScoreBoardByIdAsync(req.params.id);
      res.status(200).json({
        message: `ScoreBoard with ID = ${req.params.id} is has been successfully deleted`
      });
    } else {
      res.status(404).json({
        message: `ScoreBoard with ID = ${req.params.id} is not found!`
      });
    }
  }

  async editKPIScores(req, res) {
    const scoreBoardId = req.body.scoreBoardId;
    const KPIs = req.body.kpis;

    for (let index = 0; index <= KPIs.length; index++) {
      // Terminate the loop when all the the records has been saved to the DB
      if (index > KPIs.length - 1) {
        const scoreBoard = await scoreBoardsRepository.findScoreBoardByIdAsync(
          scoreBoardId
        );
        res.status(201).json(scoreBoard);
        break;
      }
      const kpiScoreboard = await KPIScoreBoard.findOne({
        where: { scoreBoardId, KPIId: KPIs[index].id },
        raw: true
      });

      // Break when the scoreboard does not contain the specified kpiId
      if (kpiScoreboard == null) {
        res.status(404).json({
          message: `ScoreBoard with ID = ${scoreBoardId} and KPI with ID= ${KPIs[index].id} has not been created`
        });
        break;
      }

      // Update the scores stored in the KPIScoreboard table
      const update = await KPIScoreBoard.update(
        {
          KPIScore: KPIs[index].score
        },
        { where: { id: kpiScoreboard.id } }
      );
      console.log(update);
    }
  }

  async updateScoreBoardById(req, res) {
    const scoreBoard = await scoreBoardsRepository.findScoreBoardByIdAsync(
      req.params.id
    );
    if (scoreBoard != null) {
      // Update the scoreboard
      await scoreBoardsRepository.updateScoreBoardAsync(
        req.body.name,
        req.params.id
      );
      res.status(200).json({
        message: `ScoreBoard with ID = ${req.params.id} is has been successfully updated`
      });
    } else {
      res.status(404).json({
        message: `ScoreBoard with ID = ${req.params.id} is not found!`
      });
    }
  }

  // Retrieve the scoreboard for a specific user
  async getUserScoreBoards(req, res) {
    const userId = req.query.userId;
    const userScoreboards = await scoreBoardsRepository.findScoreBoardsByUserId(
      userId
    );
    res.status(200).json(userScoreboards);
  }

  validateCreateScoreBoardInput(data) {
    let errors = {};
    // Title validation
    if (data.title == null) errors.email = 'Title is required';
    // Description validation
    if (data.userId == null) errors.password = 'UserId is required';

    if ((data.KPIIds = null || !isArray(data.KPIIds)))
      errors.KPIIds = 'KPIIds is required and must be array';

    if ((data.KPIWeights = null || !isArray(data.KPIWeights)))
      errors.KPIIds = 'KPIWeights is required and must be array';

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
}

module.exports = ScoreBoardsController;
