const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');

const contactsCont = require('../controllers/countries');

router.get('/', contactsCont.getAllCountries);

router.get('/:id', contactsCont.getACountry);

router.post('/', isAuthenticated, contactsCont.newCountry);

router.put('/:id', isAuthenticated, contactsCont.updCountries);

router.delete('/:id', isAuthenticated, contactsCont.delCountry);

module.exports = router;
