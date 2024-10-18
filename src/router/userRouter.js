const express = require('express');
const userController = require('../controller/userController');
const {authMiddleware, adminMiddleware, userMiddleware, companyMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users',authMiddleware, adminMiddleware,companyMiddleware,userController.getAllUsers);
router.get('/user/:id',authMiddleware, adminMiddleware,companyMiddleware,userController.getUserById);
router.put('/user/:id',authMiddleware, adminMiddleware,companyMiddleware, userController.updateUserById);
router.delete('/user/:id',authMiddleware, adminMiddleware,companyMiddleware,userController.deleteUserById);
// router.post('/user',authMiddleware, adminMiddleware,companyMiddleware, userController.addUser);

module.exports = router;