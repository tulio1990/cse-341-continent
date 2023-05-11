const mongodb = require('../db/conection');
const ObjectId = require('mongodb').ObjectId;
const Joi = require('joi');

// Validation and handle
const schema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/u)
    .required()
    .messages({
      'string.pattern.base': 'The name field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'name field cannot be empty'
    }),
  lastname: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/u)
    .required()
    .messages({
      'string.pattern.base': 'The lastname field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'lastname field cannot be empty'
    }),
  birthday: Joi.string()
    .pattern(/^(\d{2}\/\d{2}\/\d{4})|(\d{2}\/\d{2}\/\d{2})$/)
    .required()
    .messages({
      'string.pattern.base': 'The birthday field must be in DD/MM/YYYY or MM/DD/YYYY format'
    })
    .empty()
    .messages({
      'string.empty': 'birthday field cannot be empty'
    }),
  nickname: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/u)
    .required()
    .messages({
      'string.pattern.base': 'The nickname field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'nickname field cannot be empty'
    }),
  city: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/u)
    .required()
    .messages({
      'string.pattern.base': 'The city field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'city field cannot be empty'
    }),
  country: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/u)
    .required()
    .messages({
      'string.pattern.base': 'The country field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'country field cannot be empty'
    })
});

const getAllPeople = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('people').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAPerson = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('people').find({ _id: userId });

    // validate exist id
    const existingCountry = await mongodb
      .getDb()
      .db()
      .collection('people')
      .findOne({ _id: userId });

    if (!existingCountry) {
      return res.status(404).json({ error: 'Person not found' });
    }
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const newPerson = async (req, res) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ error: errorMessage });
    }

    const people = {
      name: req.body.name,
      lastname: req.body.lastname,
      birthday: req.body.birthday,
      nickname: req.body.nickname,
      city: req.body.city,
      country: req.body.country
    };
    const response = await mongodb.getDb().db().collection('people').insertOne(people);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the new person.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updPerson = async (req, res) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ error: errorMessage });
    }

    const userId = new ObjectId(req.params.id);

    // validate exist id
    const existingCountry = await mongodb
      .getDb()
      .db()
      .collection('people')
      .findOne({ _id: userId });

    if (!existingCountry) {
      return res.status(404).json({ error: 'Person not found' });
    }
    const person = {
      $set: {
        name: req.body.name,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        nickname: req.body.nickname,
        city: req.body.city,
        country: req.body.country
      }
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection('people')
      .updateOne({ _id: userId }, person);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the person.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const delPerson = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    // validate exist id
    const existingCountry = await mongodb
      .getDb()
      .db()
      .collection('people')
      .findOne({ _id: userId });

    if (!existingCountry) {
      return res.status(404).json({ error: 'Person not found' });
    }
    const response = await mongodb
      .getDb()
      .db()
      .collection('people')
      .deleteOne({ _id: userId }, true);
    console.log(response);

    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the person.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllPeople, getAPerson, newPerson, updPerson, delPerson };
