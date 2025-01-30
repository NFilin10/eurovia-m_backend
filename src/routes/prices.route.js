const express = require('express');
const { addTable, getTables, deleteService, addService, updateService } = require('../controllers/priceController');
const authenticate = require('../middlewares/auth.middleware')

const router = express.Router();

router.post('/add', authenticate, addTable);
router.get('/api/get-prices',authenticate, getTables);
router.delete('/delete-service/:id', authenticate, deleteService);
router.put('/update/:serviceId', authenticate, updateService);
router.post('/addService', authenticate, addService);

module.exports = router; // Ensure this is being exported
