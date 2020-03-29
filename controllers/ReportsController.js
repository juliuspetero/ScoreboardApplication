const isEmpty = require('lodash/isEmpty');
const isArray = require('lodash/isArray');
const cloneDeep = require('lodash/cloneDeep');
const fs = require('fs');

const { Report, ScoreBoard } = require('../models');

class ReportsController {
  // Retrieve all the reports from the database
  async getAllReports(req, res) {
    const reports = await Report.findAll({
      include: [
        {
          model: ScoreBoard,
          as: 'scoreboard',
          attributes: ['id', 'userId']
        }
      ]
    });
    res.status(200).json(reports);
  }

  async getScoreboardReports(req, res) {
    const scoreBoardId = req.params.id;

    const scoreboard = await ScoreBoard.findOne({
      where: { id: scoreBoardId }
    });

    if (scoreboard == null) {
      res.status(404).json({
        errorMessage: `The scoreboard with ID = ${scoreBoardId} is not found!`
      });
      return;
    }

    const reports = await Report.findAll({
      where: { scoreBoardId },
      include: [
        {
          model: ScoreBoard,
          as: 'scoreboard',
          attributes: ['id', 'userId']
        }
      ]
    });
    res.status(200).json(reports);
  }

  // Get the specifies layout from the database
  async getReportById(req, res) {
    const report = await Report.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: ScoreBoard,
          as: 'scoreboard',
          attributes: ['id', 'userId']
        }
      ]
    });
    if (report == null)
      res.status(404).json({
        message: `Report with ID = ${req.params.id} is not found!`
      });
    else res.status(200).json(report);
  }

  async createReport(req, res) {
    // Handle all the errors
    const input = cloneDeep(req.body);
    const { errors, isValid } = this.validateCreateReportInput(input);
    if (!isValid) {
      res.status(400).json(errors);
      return;
    }

    if (req.file)
      // Add the document URL property to be saved to the database
      req.body.documentUrl = req.file.filename;
    else {
      res
        .status(400)
        .json({ errorMessage: `The document file upload is required` });
      return;
    }

    const description = req.body.description;
    const scoreBoardId = req.body.scoreBoardId;

    const scoreboard = await ScoreBoard.findOne({
      where: { id: scoreBoardId }
    });

    if (scoreboard == null) {
      res.status(404).json({
        errorMessage: `The scoreboard with ID = ${scoreBoardId} is not found`
      });
      return;
    }

    if (req.file)
      // Add the document URL property to be saved to the database
      req.body.documentUrl = req.file.filename;
    else req.body.documentUrl = 'noimage.png';

    // Create Job title
    const report = await Report.create({
      description,
      documentUrl: req.body.documentUrl,
      scoreBoardId
    });

    res.status(201).json(report);
  }

  async deleteReport(req, res) {
    const report = await Report.findOne({
      where: {
        id: req.params.id
      }
    });
    if (report != null) {
      await Report.destroy({ where: { id: req.params.id } });

      // Delete document Url
      await fs.unlink(`./assets/uploads/${report.documentUrl}`, error => {
        if (error) console.log(error);
      });

      res.status(200).json({
        message: `Report with ID = ${req.params.id} is has been successfully deleted`
      });
    } else {
      res.status(404).json({
        message: `Report with ID = ${req.params.id} is not found!`
      });
    }
  }

  // Update report with as speicfic Id
  async updateReportById(req, res) {
    const report = await Report.findOne({ where: { id: req.params.id } });
    if (report != null) {
      // The user wants to change the document
      if (req.file) {
        // Query the database to get the previous photo URL
        fs.unlink(`./assets/uploads/${report.documentUrl}`, error => {
          if (error) console.log(error);
        });

        // Add the document URL property to be saved to the database
        req.body.documentUrl = req.file.filename;
      }

      // Update the report
      await Report.update(req.body, { where: { id: req.params.id } });

      // Response back with that password
      let response = {
        message: `Report with ID = ${req.params.id} has been successfully updated`
      };

      res.status(200).json(response);
    } else {
      res.status(404).json({
        message: `Report with ID = ${req.params.id} is not found!`
      });
    }
  }

  validateCreateReportInput(data) {
    let errors = {};
    // Description validation
    if (data.description == null || data.description == '')
      errors.description = 'Report description is required';
    if (data.scoreBoardId == null || data.scoreBoardId == '')
      errors.scoreboard = 'Scoreboard is required';
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
}

module.exports = ReportsController;
