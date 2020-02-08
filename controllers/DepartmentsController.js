const isEmpty = require('lodash/isEmpty');

const DepartmentsRepository = require('../repositories/departmentsRepository');
const departmentRepository = new DepartmentsRepository();

class DepartmentsController {
  async getAllDepartments(req, res) {
    const roles = await departmentRepository.findAllKPIsAsync();
    res.status(200).json(roles);
  }

  async getUserByDepartment(req, res) {
    const departmentId = req.query.departmentId;
    const users = await departmentRepository.findAllUsersByDepartmentId(
      departmentId
    );
    res.status(200).json(users);
  }

  async getDepartmentById(req, res) {
    const department = await departmentRepository.findKPIByIdAsync(
      req.params.id
    );
    if (department == null)
      res.status(404).json({
        message: `Department with ID = ${req.params.id} is not found!`
      });
    else res.status(200).json(department);
  }
  async createDepartment(req, res) {
    const { errors, isValid } = this.validateCreateKPIInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
      return;
    }
    const department = await departmentRepository.createDepartmentAsync(
      req.body
    );
    res.status(201).json(department);
  }

  async deleteDepartmentById(req, res) {
    const department = await departmentRepository.findDepartmentByIdAsync(
      req.params.id
    );
    if (kpi != null) {
      // Delete the role
      await departmentRepository.removeDepartmentByIdAsync(req.params.id);
      res.status(200).json({
        message: `Department with ID = ${req.params.id} is has been successfully deleted`
      });
    } else {
      res.status(404).json({
        message: `Department with ID = ${req.params.id} is not found!`
      });
    }
  }

  async updateDepartmentById(req, res) {
    const department = await departmentRepository.findDepartmentByIdAsync(
      req.params.id
    );
    if (department != null) {
      // Update the role
      await departmentRepository.updateDepartmentAsync(
        req.body.name,
        req.params.id
      );
      res.status(200).json({
        message: `Department with ID = ${req.params.id} is has been successfully updated`
      });
    } else {
      res.status(404).json({
        message: `KPI with ID = ${req.params.id} is not found!`
      });
    }
  }

  validateCreateKPIInput(data) {
    let errors = {};

    // Title validation
    if (data.title == null) errors.email = 'Title is required';

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
}

module.exports = DepartmentsController;
