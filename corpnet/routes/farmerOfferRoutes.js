const express = require('express');
const router = express.Router();
const {
    createOffer,
    getAllOffers,
    getOffer,
    updateOffer,
    deleteOffer,
    searchOffers
} = require('../controllers/farmerOfferController');

console.log('✅ Farmer offer routes loaded');

router.post('/', createOffer);
router.get('/', getAllOffers);
router.get('/:id', getOffer);
router.put('/:id/:status', updateOffer);

router.delete('/:id', deleteOffer);
router.get('/search/contact', searchOffers);

module.exports = router;
