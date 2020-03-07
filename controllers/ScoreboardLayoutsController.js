const isEmpty = require('lodash/isEmpty');
const isArray = require('lodash/isArray');
const cloneDeep = require('lodash/cloneDeep');

const {
  KPIScoreboardLayout,
  KPI,
  Jobtitle,
  ScoreboardLayout,
  User
} = require('../models');

class ScoreboardLayoutsController {
  // Retrieve all the layouts from the database
  async getAllscoreboardLayouts(req, res) {
    const scoreboardLayouts = await ScoreboardLayout.findAll({
      include: [
        {
          model: KPI,
          as: 'kpis',
          required: false,
          attributes: ['id', 'title'],
          through: {
            model: KPIScoreboardLayout,
            as: 'kPIScoreboardLayout',
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
    res.status(200).json(scoreboardLayouts);
  }

  // Get the specifies layout from the database
  async getScoreboardLayoutById(req, res) {
    const scoreboardLayout = await ScoreboardLayout.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: KPI,
          as: 'kpis',
          required: false, // This queries all the users even if they don't have any roles
          attributes: ['id', 'title'],
          through: {
            model: KPIScoreboardLayout,
            as: 'kPIScoreboardLayout',
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
    if (scoreboardLayout == null)
      res.status(404).json({
        message: `scoreboardLayout with ID = ${req.params.id} is not found!`
      });
    else res.status(200).json(scoreboardLayout);
  }

  async createScoreboardLayout(req, res) {
    // Handle all the errors
    const input = cloneDeep(req.body);
    const { errors, isValid } = this.validateCreatescoreboardLayoutInput(input);
    if (!isValid) {
      res.status(400).json(errors);
      return;
    }

    const title = req.body.title;
    const departmentId = req.body.departmentId;
    const KPIIds = req.body.KPIIds;
    const KPIWeights = req.body.KPIWeights;

    // Create Job title
    const jobtitle = await Jobtitle.create({ title, departmentId });

    // Insert the jobtitle ID and title into scoreboardLayouts table
    let scoreboardLayout = await ScoreboardLayout.create({
      jobtitleId: jobtitle.id
    });

    // Insert the KPIs for this scoreboardLayout
    for (let index = 0; index <= KPIIds.length; index++) {
      // Terminate the loop when all the the records has been saved to the DB
      if (index > KPIIds.length - 1) {
        scoreboardLayout = await ScoreboardLayout.findOne({
          where: { id: scoreboardLayout.id },
          include: [
            {
              model: KPI,
              as: 'kpis',
              required: false, // This queries all the users even if they don't have any roles
              attributes: ['id', 'title'],
              through: {
                model: KPIScoreboardLayout,
                as: 'kPIScoreboardLayout',
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
        res.status(201).json(scoreboardLayout);
        break;
      }

      // Search for the KPI with given id and make sure it exists
      const kpi = await KPI.findOne({ where: { id: KPIIds[index] } });

      if (kpi == null) {
        res.status(404).json({
          message: `KPI with ID = ${KPIIds[index]} is not found`
        });
        break;
      }

      // Create a KPIscoreboardLayout object
      const kPIScoreboardLayout = {
        KPIId: KPIIds[index],
        scoreboardLayoutId: scoreboardLayout.dataValues.id,
        KPIWeight: KPIWeights[index]
      };

      // Save KPIscoreboardLayout to the DB
      await KPIScoreboardLayout.create(kPIScoreboardLayout);
    }
  }

  async deleteScoreboardLayoutById(req, res) {
    const scoreboardLayout = await ScoreboardLayout.findOne({
      where: {
        id: req.params.id
      }
    });
    if (scoreboardLayout != null) {
      // Delete scoreboardLayout and its corresponding KPIscoreboardLayout
      await ScoreboardLayout.destroy({ where: { id: req.params.id } });
      await KPIScoreboardLayout.destroy({
        where: { scoreboardLayoutId: req.params.id }
      });
      res.status(200).json({
        message: `scoreboardLayout with ID = ${req.params.id} is has been successfully deleted`
      });
    } else {
      res.status(404).json({
        message: `scoreboardLayout with ID = ${req.params.id} is not found!`
      });
    }
  }

  // Update the weight of the KPIs in the scoreboardLayout
  async editKPIWeights(req, res) {
    // Alter the job the job title
    const jobtitle = req.body.jobtitle;
    const jobtitleData = await Jobtitle.findOne({ where: { id: jobtitle.id } });
    if (jobtitleData != null) {
      // Update the role
      await Jobtitle.update(
        { title: jobtitle.title, departmentId: jobtitle.departmentId },
        { where: { id: jobtitle.id } }
      );
    } else {
      res.status(404).json({
        message: `Jobtitle with ID = ${jobtitle.id} is not found!`
      });
    }

    // Alter the scoreboard layout
    const scoreboardLayoutId = req.body.scoreboardLayoutId;
    const KPIs = req.body.kpis;

    // Delete the KPIs when it is not selected
    const storedScoreboardLayout = await ScoreboardLayout.findOne({
      where: {
        id: scoreboardLayoutId
      },
      include: [
        {
          model: KPI,
          as: 'kpis',
          required: false,
          attributes: ['id', 'title'],
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

    if (storedScoreboardLayout == null) {
      res.status(400).json({
        errorMessage: `The scoreboadLayout with ID = ${scoreboardLayoutId} is not found`
      });
      return;
    }

    storedScoreboardLayout.kpis.forEach(async storedKPI => {
      if (KPIs.filter(kpi => kpi.id === storedKPI.id).length === 0) {
        // The stored KPI in the database is not selected now, it should be deleted
        await KPIScoreboardLayout.destroy({
          where: {
            scoreboardLayoutId,
            KPIId: storedKPI.id
          }
        });
      }
    });

    // Carryout validation here
    for (let index = 0; index <= KPIs.length; index++) {
      // Terminate the loop when all the the records has been saved to the DB
      if (index > KPIs.length - 1) {
        const scoreboardLayout = await ScoreboardLayout.findOne({
          where: { id: scoreboardLayoutId },
          include: [
            {
              model: KPI,
              as: 'kpis',
              required: false,
              attributes: ['id', 'title'],
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
        res.status(201).json(scoreboardLayout);
        break;
      }
      const kpiScoreboardLayout = await KPIScoreboardLayout.findOne({
        where: { scoreboardLayoutId, KPIId: KPIs[index].id },
        raw: true
      });

      // Craete scoreboardLayoutId table when the scoreboardLayout does not contain the specified KPIId
      if (kpiScoreboardLayout == null) {
        // Check if the specified KPIId exist
        if (
          (await ScoreboardLayout.findOne({
            where: { id: scoreboardLayoutId }
          })) == null
        ) {
          res.status(404).json({
            message: `ScoreboardLayout with ID = ${scoreboardLayoutId} has not been created yet`
          });
          break;
        }

        if ((await KPI.findOne({ where: { id: KPIs[index].id } })) == null) {
          res.status(404).json({
            message: `KPI with ID = ${KPIs[index].id} has not been created yet`
          });
          break;
        }

        //Create a KPIscoreboardLayout object
        const kPIScoreboardLayout = {
          KPIId: KPIs[index].id,
          scoreboardLayoutId,
          KPIWeight: KPIs[index].weight
        };

        // Save KPIscoreboardLayout to the DB
        await KPIScoreboardLayout.create(kPIScoreboardLayout);
      }

      // Update the scores stored in the KPIscoreboardLayout table
      else
        await KPIScoreboardLayout.update(
          {
            KPIWeight: KPIs[index].weight
          },
          { where: { id: kpiScoreboardLayout.id } }
        );
    }
  }

  // Retrieve the scoreboardLayout for a specific user
  async getUserScoreboardLayout(req, res) {
    const userId = req.query.userId;
    const user = await User.findOne({ where: { id: userId } });

    if (user == null) {
      res.status(404).json({
        errorMessage: `User with ID = ${userId} is not found`
      });
      return;
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

    if (userScoreboardLayout != null)
      res.status(200).json(userScoreboardLayout);
    else
      res.status(404).json({
        errorMessage: `ScoreboardLayout for user with ID = ${userId} is not found`
      });
  }

  validateCreatescoreboardLayoutInput(data) {
    let errors = {};
    // Description validation
    if (data.title == null || data.title == '')
      errors.title = 'Job title is required';
    if (data.departmentId == null || data.departmentId == '')
      errors.department = 'Department is required';

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

module.exports = ScoreboardLayoutsController;
