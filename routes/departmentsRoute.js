const express = require('express');
const router = express.Router();
const passport = require('../helpers/passportAuthentication');

const DepartmentsController = require('../controllers/DepartmentsController');
const departmentsController = new DepartmentsController();

router.get('/get-users-by-department', (req, res) =>
  departmentsController.getUserByDepartment(req, res)
);
router.get('/', (req, res) => {
  // A user must be a admin to access this controller action method
  if (req.user.roles[0].id == '3by786gk6s03iu2') {
    departmentsController.getAllDepartments(req, res);
  } else {
    res
      .status(403)
      .json({ message: 'You are not authorized to access this resource' });
    return;
  }
});

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
