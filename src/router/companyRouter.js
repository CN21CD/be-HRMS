const express = require('express');
const companyController = require('../controller/companyController');
const {authMiddleware, adminMiddleware,userMiddleware,companyMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/company',authMiddleware,adminMiddleware,companyMiddleware,companyController.getAllCompanies);
router.put('/company',authMiddleware,adminMiddleware,companyMiddleware,companyController.updateCompanyByID);
// router.get('/company/:id',verifyToken.authMiddleware,verifyToken.userMiddleware,companyController.getCompanyById);
// router.post('/company',companyController.addCompany);
// router.delete('/company/:id',companyController.deleteCompanyByID);
module.exports = router;