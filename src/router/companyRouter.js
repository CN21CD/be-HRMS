const express = require('express');
const companyController = require('../controller/companyController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/companies',verifyToken.authMiddleware,verifyToken.userMiddleware,companyController.getAllCompanies);
router.get('/company/:id',verifyToken.userMiddleware,companyController.getCompanyById);
// router.post('/company',companyController.addCompany);
router.put('/company/:id',verifyToken.userMiddleware,companyController.updateCompanyByID); 
// router.delete('/company/:id',companyController.deleteCompanyByID);
module.exports = router;