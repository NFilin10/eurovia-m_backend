const express = require('express');
const { addTable, getTables, deleteService, addService, updateService } = require('../controllers/priceController');
const authenticate = require('../middlewares/auth.middleware')

const router = express.Router();

router.post('/add', addTable);
router.get('/api/get-prices', getTables);
router.delete('/delete-service/:id', deleteService);
router.put('/update/:serviceId', updateService);
router.post('/addService', addService);

module.exports = router; // Ensure this is being exported
