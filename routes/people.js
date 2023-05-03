const express = require('express');
const router = express.Router();

const contactsCont = require('../controllers/people');

router.get('/', contactsCont.getAllPeople);

router.get('/:id', contactsCont.getAPerson);

router.post('/', contactsCont.newPerson);

// router.put('/:id', contactsCont.updContact);

// router.delete('/:id', contactsCont.delContact);

module.exports = router;
