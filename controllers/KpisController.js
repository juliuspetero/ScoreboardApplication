const isEmpty = require('lodash/isEmpty');
const KpisRepository = require('../repositories/KpisRepository');
const kpisRepository = new KpisRepository();
const AccountsRepository = require('../repositories/AccountsRepository');
const accountsRepository = new AccountsRepository();

class RolesController {
  async getAllKPIs(req, res) {
    const roles = await kpisRepository.findAllKPIsAsync();
    res.status(200).json(roles);
  }
  async getKPIById(req, res) {
    const kpi = await kpisRepository.findKPIByIdAsync(req.params.id);
    if (kpi == null)
      res
        .status(404)
        .json({ message: `KPI with ID = ${req.params.id} is not found!` });
    else res.status(200).json(kpi);
  }
  async createKPI(req, res) {
    const { errors, isValid } = this.validateCreateKPIInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
      return;
    }
    const kpi = await kpisRepository.createKPIAsync(req.body);
    res.status(201).json(kpi);
  }

  async deleteKPIById(req, res) {
    const kpi = await kpisRepository.findKPIByIdAsync(req.params.id);
    if (kpi != null) {
      // Delete the role
      await kpisRepository.removeKPIByIdAsync(req.params.id);
      res.status(200).json({
        message: `KPI with ID = ${req.params.id} is has been successfully deleted`
      });
    } else {
      res.status(404).json({
        message: `KPI with ID = ${req.params.id} is not found!`
      });
    }
  }

  async updateKPIById(req, res) {
    const kpi = await kpisRepository.findKPIByIdAsync(req.params.id);
    if (kpi != null) {
      // Update the role
      await kpisRepository.updateKPIAsync(req.body.name, req.params.id);
      res.status(200).json({
        message: `KPI with ID = ${req.params.id} is has been successfully updated`
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
    // Description validation
    if (data.description == null) errors.password = 'Password is required';

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
}

module.exports = RolesController;
