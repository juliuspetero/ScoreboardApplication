const express = require('express');
const router = express.Router();
const passport = require('../helpers/passportAuthentication');

const DepartmentsController = require('../controllers/DepartmentsController');
const departmentsController = new DepartmentsController();

router.get('/get-users-by-department', (req, res) =>
  departmentsController.getUserByDepartment(req, res)
);
router.get('/', (req, res) =>
  departmentsController.getAllDepartments(req, res)
);

router.get('/:id', (req, res) =>
  departmentsController.getDepartmentById(req, res)
);
router.delete('/:id', (req, res) =>
  departmentsController.deleteDepartmentById(req, res)
);
router.put('/:id', (req, res) =>
  departmentsController.updateDepartmentById(req, res)
);
router.post('/', (req, res) =>
  departmentsController.createDepartment(req, res)
);

module.exports = router;
