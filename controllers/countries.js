const mongodb = require('../db/conection');
const ObjectId = require('mongodb').ObjectId;
const Joi = require('joi');

// Validation and handle
const schema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'The name field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'name field cannot be empty'
    }),
  capital: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'The capital field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'capital field cannot be empty'
    }),
  lenguage: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'The language field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'lenguage field cannot be empty'
    }),
  demonym: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'The demonym field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'demonym field cannot be empty'
    }),
  government: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'The government field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'government field cannot be empty'
    }),
  president: Joi.string()
    .pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'The president field only accepts letters'
    })
    .empty()
    .messages({
      'string.empty': 'president field cannot be empty'
    }),
  population: Joi.string()
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.pattern.base': 'The population field only accepts numbers'
    })
    .empty()
    .messages({
      'string.empty': 'population field cannot be empty'
    })
});

const getAllCountries = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('countries').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getACountry = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('countries').find({ _id: userId });

    // validate exist id
    const existingCountry = await mongodb
      .getDb()
      .db()
      .collection('countries')
      .findOne({ _id: userId });

    if (!existingCountry) {
      return res.status(404).json({ error: 'Country not found' });
    }

    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const newCountry = async (req, res) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ error: errorMessage });
    }

    const country = {
      name: req.body.name,
      capital: req.body.capital,
      lenguage: req.body.lenguage,
      demonym: req.body.demonym,
      government: req.body.government,
      president: req.body.president,
      population: req.body.population
    };
    const response = await mongodb.getDb().db().collection('countries').insertOne(country);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the new contact.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updCountries = async (req, res) => {
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
      .collection('countries')
      .findOne({ _id: userId });

    if (!existingCountry) {
      return res.status(404).json({ error: 'Country not found' });
    }
    const country = {
      $set: {
        name: req.body.name,
        capital: req.body.capital,
        lenguage: req.body.lenguage,
        demonym: req.body.demonym,
        government: req.body.government,
        president: req.body.president,
        population: req.body.population
      }
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection('countries')
      .updateOne({ _id: userId }, country);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the contact.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const delCountry = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    // validate exist id
    const existingCountry = await mongodb
      .getDb()
      .db()
      .collection('countries')
      .findOne({ _id: userId });

    if (!existingCountry) {
      return res.status(404).json({ error: 'Country not found' });
    }

    const response = await mongodb
      .getDb()
      .db()
      .collection('countries')
      .deleteOne({ _id: userId }, true);
    console.log(response);

    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllCountries, getACountry, newCountry, updCountries, delCountry };
