const mongodb = require('../db/conection');
const ObjectId = require('mongodb').ObjectId;

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
      res.status(500).json(response.error || 'Some error occurred while creating the new contact.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const updContact = async (req, res) => {
//   try {
//     const userId = new ObjectId(req.params.id);
//     const contact = {
//       $set: {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         favoriteColor: req.body.favoriteColor,
//         birthday: req.body.birthday
//       }
//     };
//     const response = await mongodb
//       .getDb()
//       .db()
//       .collection('contacts')
//       .updateOne({ _id: userId }, contact);
//     console.log(response);
//     if (response.modifiedCount > 0) {
//       res.status(204).send();
//     } else {
//       res.status(500).json(response.error || 'Some error occurred while updating the contact.');
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const delContact = async (req, res) => {
//   try {
//     const userId = new ObjectId(req.params.id);
//     const response = await mongodb
//       .getDb()
//       .db()
//       .collection('contacts')
//       .deleteOne({ _id: userId }, true);
//     console.log(response);
//     if (response.deletedCount > 0) {
//       res.status(200).send();
//     } else {
//       res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
//     }
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

module.exports = { getAllPeople, getAPerson, newPerson };
