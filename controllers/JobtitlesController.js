const isEmpty = require('lodash/isEmpty');

const { Jobtitle, Department, User } = require('../models');

class JobtitlesController {
  async getAllJobtitles(req, res) {
    const jobtitles = await Jobtitle.findAll({
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'title']
        }
      ]
    });
    res.status(200).json(jobtitles);
  }

  async getUsersByjobtitle(req, res) {
    const jobtitleId = req.query.jobtitleId;
    const users = await User.findAll({ where: { jobtitleId } });
    res.status(200).json(users);
  }

  async getjobtitleById(req, res) {
    const jobtitle = await Jobtitle.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'title']
        }
      ]
    });
    if (jobtitle == null)
      res.status(404).json({
        message: `jobtitle with ID = ${req.params.id} is not found!`
      });
    else res.status(200).json(jobtitle);
  }
  async createJobtitle(req, res) {
    const { errors, isValid } = this.validateCreateJobtitleInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
      return;
    }
    const jobtitle = await Jobtitle.create(req.body);
    res.status(201).json(jobtitle);
  }

  async deleteJobtitleById(req, res) {
    const jobtitle = await Jobtitle.findOne({ where: { id: req.params.id } });
    if (jobtitle != null) {
      // Delete the role
      await Jobtitle.destroy({ where: { id: req.params.id } });
      res.status(200).json({
        message: `Jobtitle with ID = ${req.params.id} is has been successfully deleted`
      });
    } else {
      res.status(404).json({
        message: `Jobtitle with ID = ${req.params.id} is not found!`
      });
    }
  }

  async updateJobtitleById(req, res) {
    const jobtitle = await Jobtitle.findOne({ where: { id: req.params.id } });
    if (jobtitle != null) {
      // Update the role
      await Jobtitle.update(req.body, { where: { id: req.params.id } });
      res.status(200).json({
        message: `Jobtitle with ID = ${req.params.id} is has been successfully updated`
      });
    } else {
      res.status(404).json({
        message: `Jobtitle with ID = ${req.params.id} is not found!`
      });
    }
  }

  validateCreateJobtitleInput(data) {
    let errors = {};

    // Title validation
    if (data.title == null) errors.title = 'Title is required';
    if (data.departmentId == null || data.departmentId == '')
      errors.department = 'Department is required';

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
}

module.exports = JobtitlesController;
