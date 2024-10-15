const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.post('/user', userController.addUser);
router.put('/user/:id', userController.updateUserById);
// router.delete('/user/:id', userController.deleteUserById);

module.exports = router;