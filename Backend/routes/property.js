const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const uploadFile = require('../middlewares/upload');
const checkToken = require('../middlewares/checkToken')
const isAdmin = require('../middlewares/isAdmin')

router.post('/create', checkToken, isAdmin(), uploadFile(), propertyController.createProperty);

router.get('/search', propertyController.globalSearchProperties);

router.get('/:id', checkToken, propertyController.fetchSingleProperty);

router.get('/', propertyController.fetchAllProperties);

router.patch('/:id', checkToken, isAdmin(), uploadFile(), propertyController.updateProperty);

router.delete('/:id/images', checkToken, isAdmin(), propertyController.removeImg);

router.delete('/:id', checkToken, isAdmin(), propertyController.deleteProperty);

router.post('/:propertyId/reviews', checkToken, propertyController.addReview);

module.exports = router;