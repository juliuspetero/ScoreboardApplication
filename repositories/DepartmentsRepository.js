const { Department, User } = require('../models');

class DepartmentsRepository {
  // Fetch all the departments in the database
  async findAllDepartmentsAsync() {
    return await Department.findAll();
  }

  // Fetch all the departments in the database
  async findAllUsersByDepartmentId(departmentId) {
    return await User.findAll({
      where: { departmentId }
    });
  }

  // Find a particular department by his unique Id
  async findDepartmentByIdAsync(id) {
    return await Department.findOne({
      where: { id }
    });
  }

  async createDepartmentAsync(department) {
    return await Department.create(department);
  }

  async removeDepartmentByIdAsync(id) {
    return await Department.destroy({ where: { id } });
  }

  async updateDepartmentAsync(department, id) {
    return await Department.update(department, { where: { id } });
  }
}

module.exports = DepartmentsRepository;
