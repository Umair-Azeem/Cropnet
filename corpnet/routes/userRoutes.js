const express = require('express');
const { 
    getAllUsers, 
    getUser, 
    updateUser, 
    deleteUser, 
    toggleUserStatus 
} = require('../controllers/userController');

const router = express.Router();

// User management routes
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/toggle-status', toggleUserStatus);

module.exports = router; 