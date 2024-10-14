const express = require('express');
const companyController = require('../controller/companyController');

const router = express.Router();

router.get('/companies',companyController.getAllCompanies);
router.get('/company/:id',companyController.getCompanyById);
router.post('/company',companyController.addCompany);
router.put('/company/:id',companyController.updateCompanyByID); // đi kèm id
router.delete('/company/:id',companyController.deleteCompanyByID); // đi kèm id

module.exports = router;