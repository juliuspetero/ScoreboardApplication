const {
  User,
  Role,
  UserRole,
  Department,
  KPI,
  ScoreBoard,
  KPIScoreBoard
} = require('../models');

class KpisRepository {
  // Fetch all the roles in the database
  async findAllKPIsAsync() {
    return await KPI.findAll({
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'title']
        }
      ]
    });
  }

  // Find a particular role by his unique Id
  async findKPIByIdAsync(id) {
    return await KPI.findOne({
      where: { id },
      include: [
        {
          model: ScoreBoard,
          as: 'scoreBoards',
          required: false,
          attributes: ['id', 'userId'],
          through: {
            model: KPIScoreBoard,
            as: 'kPIScoreBoards',
            attributes: []
          }
        }
      ]
    });
  }

  async createKPIAsync(kpi) {
    return await KPI.create(kpi);
  }

  async removeKPIByIdAsync(id) {
    return await KPI.destroy({ where: { id } });
  }

  async updateKPIAsync(kpi, id) {
    return await KPI.update(kpi, { where: { id } });
  }
}

module.exports = KpisRepository;
