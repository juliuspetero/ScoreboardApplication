const {
  User,
  Role,
  UserRole,
  KPI,
  ScoreBoard,
  KPIScoreBoard
} = require('../models');

class ScoreBoardsRepository {
  // Fetch all the roles in the database
  async findAllScoreBoardsAsync() {
    return await ScoreBoard.findAll({
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
      // limit: 1,
      order: [['updatedAt', 'DESC']]
    });
  }

  // Fetch all the roles in the database
  async findScoreBoardsByUserId(userId) {
    return await ScoreBoard.findAll({
      where: { userId },
      include: [
        {
          model: KPI,
          as: 'kpis',
          required: false, // This queries all the users even if they don't have any roles
          attributes: ['id', 'title', 'description'],
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
      order: [['createdAt', 'DESC']]
    });
  }

  // Find a particular scoreboard by his unique Id
  async findScoreBoardByIdAsync(id) {
    return await ScoreBoard.findOne({
      where: { id },
      include: [
        {
          model: KPI,
          as: 'kpis',
          required: false,
          attributes: ['id', 'title'],
          through: {
            model: KPIScoreBoard,
            as: 'kPIScoreBoards',
            attributes: ['KPIWeight', 'KPIScore']
          }
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'departmentId']
        }
      ]
    });
  }

  async createScoreBoardAsync(scoreboard) {
    try {
      return await ScoreBoard.create(scoreboard);
    } catch (error) {
      return error;
    }
  }

  async removeScoreBoardByIdAsync(id) {
    return await ScoreBoard.destroy({ where: { id } });
  }

  async updateScoreBoardAsync(scoreboard, id) {
    return await ScoreBoard.update(scoreboard, { where: { id } });
  }
}

module.exports = ScoreBoardsRepository;
