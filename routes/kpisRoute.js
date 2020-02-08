const express = require('express');
const router = express.Router();
const passport = require('../helpers/passportAuthentication');

const KpisController = require('../controllers/KpisController');
const kpisController = new KpisController();

router.get('/', (req, res) => kpisController.getAllKPIs(req, res));
router.get('/:id', (req, res) => kpisController.getKPIById(req, res));
router.delete('/:id', (req, res) => kpisController.deleteKPIById(req, res));
router.put('/:id', (req, res) => kpisController.updateKPIById(req, res));
router.post('/', (req, res) => kpisController.createKPI(req, res));

module.exports = router;
