const express = require('express');
const router = express.Router();

const contactsCont = require('../controllers/people');

router.get('/', contactsCont.getAllPeople);

router.get('/:id', contactsCont.getAPerson);

router.post('/', contactsCont.newPerson);

router.put('/:id', contactsCont.updPerson);

router.delete('/:id', contactsCont.delPerson);

module.exports = router;
