const isEmpty = require('lodash/isEmpty');
const isArray = require('lodash/isArray');
const cloneDeep = require('lodash/cloneDeep');
const moment = require('moment');
const { Op } = require('sequelize');

const ScoreBoardsRepository = require('../repositories/ScoreBoardsRepository');
const scoreBoardsRepository = new ScoreBoardsRepository();
const KpisRepository = require('../repositories/KpisRepository');
const kpisRepository = new KpisRepository();
const AccountsRepository = require('../repositories/AccountsRepository');
const accountsRepository = new AccountsRepository();

const {
  KPIScoreBoard,
  User,
  KPI,
  ScoreBoard,
  ScoreboardLayout,
  KPIScoreboardLayout,
  Jobtitle
} = require('../models');

class ScoreBoardsController {
  async getAllScoreBoards(req, res) {
    const scoreboards = await scoreBoardsRepository.findAllScoreBoardsAsync();
    res.status(200).json(scoreboards);
  }

  // GET SCOREBOARDS FOR SPECIFIED DEPARTMENT AND CALCULATED COMMULATIVE FOR EACH EMPLOYEE
  async getScoreboards(req, res) {
    const departmentId = req.params.departmentId;
    const queryBy = req.params.queryBy;

    let scoreboards = null;

    if (queryBy == '1month') {
      // Scoreboards within one month
      const MONTH_START = moment()
        .date(1)
        .hour(3)
        .minute(0)
        .seconds(0)
        .toDate();
      scoreboards = await ScoreBoard.findAll({
        include: [
          {
            model: KPI,
            as: 'kpis',
            required: false, // This queries all the users even if they don't have any roles
            attributes: ['id', 'title'],
            through: {
              model: KPIScoreBoard,
              as: 'kPIScoreBoard',
              attributes: ['KPIWeight', 'KPIScore']
            }
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'departmentId']
          }
        ],
        order: [['updatedAt', 'DESC']],
        where: {
          createdAt: {
            [Op.gte]: MONTH_START
          }
        }
      });
    } else if (queryBy == '3months') {
      // Scoreboard within 3 months
      scoreboards = await ScoreBoard.findAll({
        include: [
          {
            model: KPI,
            as: 'kpis',
            required: false, // This queries all the users even if they don't have any roles
            attributes: ['id', 'title'],
            through: {
              model: KPIScoreBoard,
              as: 'kPIScoreBoard',
              attributes: ['KPIWeight', 'KPIScore']
            }
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'departmentId']
          }
        ],
        order: [['updatedAt', 'DESC']],
        where: {
          createdAt: {
            [Op.gte]: moment()
              .subtract(3, 'months')
              .toDate()
          }
        }
      });
    } else if (queryBy == '6months') {
      // Scoreboards within 6 months

      scoreboards = await ScoreBoard.findAll({
        include: [
          {
            model: KPI,
            as: 'kpis',
            required: false, // This queries all the users even if they don't have any roles
            attributes: ['id', 'title'],
            through: {
              model: KPIScoreBoard,
              as: 'kPIScoreBoard',
              attributes: ['KPIWeight', 'KPIScore']
            }
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'departmentId']
          }
        ],
        order: [['updatedAt', 'DESC']],
        where: {
          createdAt: {
            [Op.gte]: moment()
              .subtract(6, 'months')
              .toDate()
          }
        }
      });
    } else if (queryBy == '1year') {
      // Scoreboard within one year
      const YEAR_START = moment()
        .month(0)
        .date(1)
        .hour(3)
        .minute(0)
        .seconds(0)
        .toDate();

      scoreboards = await ScoreBoard.findAll({
        include: [
          {
            model: KPI,
            as: 'kpis',
            required: false, // This queries all the users even if they don't have any roles
            attributes: ['id', 'title'],
            through: {
              model: KPIScoreBoard,
              as: 'kPIScoreBoard',
              attributes: ['KPIWeight', 'KPIScore']
            }
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'departmentId']
          }
        ],
        order: [['updatedAt', 'DESC']],
        where: {
          createdAt: {
            [Op.gte]: YEAR_START
          }
        }
      });
    } else {
      res.status(404).json({
        message: `The duration query ${queryBy} is not found!`
      });
      return;
    }

    // Filter all the scoreboards which belongs to the specified departments
    scoreboards = scoreboards.filter(sb => {
      if (sb.user.departmentId == departmentId) return true;
    });

    res.status(200).json(scoreboards);
  }

  async getScoreboardById(req, res) {
    const scoreBoard = await scoreBoardsRepository.findScoreBoardByIdAsync(
      req.params.id
    );
    if (scoreBoard == null)
      res.status(404).json({
        message: `ScoreBoard with ID = ${req.params.id} is not found!`
      });
    else res.status(200).json(scoreBoard);
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

    // Insert the userId and title into scoreboards table
    let scoreBoard = await scoreBoardsRepository.createScoreBoardAsync({
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
        KPIWeight: KPIWeights[index],
        KPIScore: 0
      };

      // Save KPIScoreboard to the DB
      await KPIScoreBoard.create(kPIScoreBoard);
    }
  }

  async createScoreBoardList(req, res) {
    const input = cloneDeep(req.body);
    const { errors, isValid } = this.validateCreateScoreboardListInput(input);
    if (!isValid) {
      res.status(400).json(errors);
      return;
    }

    const userIds = req.body.userIds;

    // Loop through all the users supplied
    for (let i = 0; i <= userIds.length; i++) {
      if (i > userIds.length - 1) {
        res
          .status(201)
          .json({ message: 'The scoreboards have been create successfully' });
        break;
      }

      const user = await User.findOne({
        where: {
          id: userIds[i]
        }
      });

      if (user === null) {
        res.status(404).json({
          message: `User with ID = ${userIds[i]} is not found!`
        });

        break;
      }

      const userScoreboardLayout = await ScoreboardLayout.findOne({
        where: {
          jobtitleId: user.jobtitleId
        },
        include: [
          {
            model: KPI,
            as: 'kpis',
            required: false,
            attributes: ['id', 'title', 'description'],
            through: {
              model: KPIScoreboardLayout,
              as: 'kPIScoreboardLayouts',
              attributes: ['KPIWeight']
            }
          },
          {
            model: Jobtitle,
            as: 'jobtitle',
            attributes: ['id', 'title', 'departmentId']
          }
        ]
      });

      // console.log(userScoreboardLayout);

      // The user scoreboard layout has been saved to the database
      if (userScoreboardLayout !== null) {
        const kpis = userScoreboardLayout.kpis;

        let scoreBoard = await scoreBoardsRepository.createScoreBoardAsync({
          userId: userIds[i]
        });

        // Insert the KPIs for this scoreBoard
        for (let index = 0; index <= kpis.length; index++) {
          // Terminate the loop when all the the records has been saved to the DB
          if (index > kpis.length - 1) {
            scoreBoard = await scoreBoardsRepository.findScoreBoardByIdAsync(
              scoreBoard.dataValues.id
            );
            // res.status(201).json(scoreBoard);
            break;
          }

          // Search for the KPI with given id and make sure it exists
          const KPI = await kpisRepository.findKPIByIdAsync(kpis[index].id);

          if (KPI == null) {
            res.status(404).json({
              message: `KPI with ID = ${kpis[index].id} is not found`
            });
            break;
          }

          // Create a KPIScoreboard object
          const kPIScoreBoard = {
            KPIId: kpis[index].id,
            scoreBoardId: scoreBoard.dataValues.id,
            KPIWeight: kpis[index].kPIScoreboardLayouts.KPIWeight,
            KPIScore: 0
          };

          // console.log(kpis[index].kPIScoreboardLayouts);
          // return;

          // Save KPIScoreboard to the DB
          await KPIScoreBoard.create(kPIScoreBoard);
        }
      }
    }
  }

  async deleteScoreBoardById(req, res) {
    const scoreBoard = await scoreBoardsRepository.findScoreBoardByIdAsync(
      req.params.id
    );
    if (scoreBoard != null) {
      // Delete Scoreboard and its corresponding KPIScoreboard
      await scoreBoardsRepository.removeScoreBoardByIdAsync(req.params.id);
      await KPIScoreBoard.destroy({ where: { scoreBoardId: req.params.id } });
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

    // Update the updatedAt to the current date and time
    await ScoreBoard.update(
      { id: scoreBoardId },
      { where: { id: scoreBoardId } }
    );

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

      // Update scores stored in the KPIScoreboard table
      await KPIScoreBoard.update(
        {
          KPIScore: KPIs[index].score
        },
        { where: { id: kpiScoreboard.id } }
      );
    }
  }

  // Update the weight of the KPIs in the scoreboard
  async editKPIWeights(req, res) {
    const scoreBoardId = req.body.scoreBoardId;
    const KPIs = req.body.kpis;
    // Delete the KPIs when it is not selected
    const storedScoreboard = await scoreBoardsRepository.findScoreBoardByIdAsync(
      scoreBoardId
    );

    storedScoreboard.kpis.forEach(async storedKPI => {
      if (KPIs.filter(kpi => kpi.id === storedKPI.id).length === 0) {
        // The stored KPI in the database is not selected now, it should be deleted
        await KPIScoreBoard.destroy({
          where: {
            scoreBoardId,
            KPIId: storedKPI.id
          }
        });
      }
    });

    // Carryout validation here
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

      // Craete scoreboardId table when the scoreboard does not contain the specified KPIId
      if (kpiScoreboard == null) {
        // Check if the specified KPIId exist
        if (
          (await ScoreBoard.findOne({ where: { id: scoreBoardId } })) == null
        ) {
          res.status(404).json({
            message: `ScoreBoard with ID = ${scoreBoardId} has not been created yet`
          });
          break;
        }

        if ((await KPI.findOne({ where: { id: KPIs[index].id } })) == null) {
          res.status(404).json({
            message: `KPI with ID = ${KPIs[index].id} has not been created yet`
          });
          break;
        }

        //Create a KPIScoreboard object
        const kPIScoreBoard = {
          KPIId: KPIs[index].id,
          scoreBoardId,
          KPIWeight: KPIs[index].weight,
          KPIScore: 0
        };

        // Save KPIScoreboard to the DB
        await KPIScoreBoard.create(kPIScoreBoard);
      }

      // Update the scores stored in the KPIScoreboard table
      else
        await KPIScoreBoard.update(
          {
            KPIWeight: KPIs[index].weight
          },
          { where: { id: kpiScoreboard.id } }
        );
    }
  }

  // GET SCOREBOARDS FOR SPECIFIED USER FOR A SPECIFIED DURATION
  async getUserScoreboardsbyDuration(req, res) {
    const userId = req.params.userId;
    const queryBy = req.params.queryBy;

    let scoreboards = null;

    if (queryBy == '1month') {
      // Scoreboards within one month
      const MONTH_START = moment()
        .date(1)
        .hour(3)
        .minute(0)
        .seconds(0)
        .toDate();
      scoreboards = await ScoreBoard.findAll({
        include: [
          {
            model: KPI,
            as: 'kpis',
            required: false, // This queries all the users even if they don't have any roles
            attributes: ['id', 'title'],
            through: {
              model: KPIScoreBoard,
              as: 'kPIScoreBoard',
              attributes: ['KPIWeight', 'KPIScore']
            }
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'departmentId']
          }
        ],
        order: [['updatedAt', 'DESC']],
        where: {
          createdAt: {
            [Op.gte]: MONTH_START
          }
        }
      });
    } else if (queryBy == '3months') {
      // Scoreboard within 3 months
      scoreboards = await ScoreBoard.findAll({
        include: [
          {
            model: KPI,
            as: 'kpis',
            required: false, // This queries all the users even if they don't have any roles
            attributes: ['id', 'title'],
            through: {
              model: KPIScoreBoard,
              as: 'kPIScoreBoard',
              attributes: ['KPIWeight', 'KPIScore']
            }
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'departmentId']
          }
        ],
        order: [['updatedAt', 'DESC']],
        where: {
          createdAt: {
            [Op.gte]: moment()
              .subtract(3, 'months')
              .toDate()
          }
        }
      });
    } else if (queryBy == '6months') {
      // Scoreboards within 6 months

      scoreboards = await ScoreBoard.findAll({
        include: [
          {
            model: KPI,
            as: 'kpis',
            required: false, // This queries all the users even if they don't have any roles
            attributes: ['id', 'title'],
            through: {
              model: KPIScoreBoard,
              as: 'kPIScoreBoard',
              attributes: ['KPIWeight', 'KPIScore']
            }
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'departmentId']
          }
        ],
        order: [['updatedAt', 'DESC']],
        where: {
          createdAt: {
            [Op.gte]: moment()
              .subtract(6, 'months')
              .toDate()
          }
        }
      });
    } else if (queryBy == '1year') {
      // Scoreboard within one year
      const YEAR_START = moment()
        .month(0)
        .date(1)
        .hour(3)
        .minute(0)
        .seconds(0)
        .toDate();

      scoreboards = await ScoreBoard.findAll({
        include: [
          {
            model: KPI,
            as: 'kpis',
            required: false, // This queries all the users even if they don't have any roles
            attributes: ['id', 'title'],
            through: {
              model: KPIScoreBoard,
              as: 'kPIScoreBoard',
              attributes: ['KPIWeight', 'KPIScore']
            }
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'departmentId']
          }
        ],
        order: [['updatedAt', 'DESC']],
        where: {
          createdAt: {
            [Op.gte]: YEAR_START
          }
        }
      });
    } else {
      res.status(404).json({
        message: `The duration query ${queryBy} is not found!`
      });
      return;
    }

    // Filter all the scoreboards which belongs to the specified departments
    scoreboards = scoreboards.filter(sb => {
      if (sb.user.id == userId) return true;
    });

    res.status(200).json(scoreboards);
  }

  // Retrieve the scoreboard for a specific user
  async getUserScoreBoards(req, res) {
    const userId = req.query.userId;
    const userScoreboards = await scoreBoardsRepository.findScoreBoardsByUserId(
      userId
    );
    res.status(200).json(userScoreboards);
  }

  // Update the approval status of the scoreboard
  async updateScoreboardApproval(req, res) {
    const id = req.params.id;
    const scoreboard = await ScoreBoard.findOne({ where: { id } });
    if (scoreboard == null)
      res
        .status(404)
        .json({ errorMessage: `The scoreboard with ID = ${id} is not found` });
    else {
      await ScoreBoard.update(
        { isApproved: !scoreboard.isApproved },
        { where: { id } }
      );

      res
        .status(201)
        .json({ message: `The scoreboard with ID = ${id} has been updated` });
    }
  }

  validateCreateScoreboardListInput(data) {
    let errors = {};
    // Description validation
    if (data.userIds == null || !isArray(data.userIds)) {
      errors.userIds = 'UserIds is required and must be an array';
    }

    if (isArray(data.userIds) && isEmpty(data.userIds)) {
      errors.userIds = 'UserIds cannot be empty';
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }

  validateCreateScoreBoardInput(data) {
    let errors = {};
    // Description validation
    if (data.userId == null) errors.userId = 'UserId is required';

    if (data.KPIIds == null || !isArray(data.KPIIds))
      errors.KPIIds = 'KPIIds is required and must be array';

    if (data.KPIWeights == null || !isArray(data.KPIWeights))
      errors.KPIWeights = 'KPIWeights is required and must be array';

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
}

module.exports = ScoreBoardsController;
