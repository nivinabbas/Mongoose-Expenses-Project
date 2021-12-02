const express = require('express');
const router = express.Router();
let Expense = require('../model/Expense');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true });

router.get('/expense', function (request, response) {
  Expense.find({}, function (err, expenses) {
    response.send(expenses);
  }).sort({ date: -1 });
});

module.exports = router;
