const express = require('express');
const router = express.Router();

const contactsCont = require('../controllers/countries');

router.get('/', contactsCont.getAllCountries);

router.get('/:id', contactsCont.getACountry);

router.post('/', contactsCont.newCountry);

router.put('/:id', contactsCont.updCountries);

router.delete('/:id', contactsCont.delCountry);

module.exports = router;
