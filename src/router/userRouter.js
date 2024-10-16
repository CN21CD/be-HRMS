const express = require('express');
const userController = require('../controller/userController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users',verifyToken.authMiddleware, verifyToken.adminMiddleware,userController.getAllUsers);
router.get('/user/:id',verifyToken.authMiddleware, verifyToken.adminMiddleware,userController.getUserById);
router.post('/user',verifyToken.authMiddleware,verifyToken.adminMiddleware, userController.addUser);
router.put('/user/:id',verifyToken.authMiddleware,verifyToken.adminMiddleware, userController.updateUserById);
// router.delete('/user/:id', userController.deleteUserById);

module.exports = router;