const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');

const contactsCont = require('../controllers/people');

router.get('/', contactsCont.getAllPeople);

router.get('/:id', contactsCont.getAPerson);

router.post('/', isAuthenticated, contactsCont.newPerson);

router.put('/:id', isAuthenticated, contactsCont.updPerson);

router.delete('/:id', isAuthenticated, contactsCont.delPerson);

module.exports = router;
