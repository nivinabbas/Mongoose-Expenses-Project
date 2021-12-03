const express = require('express');
const router = express.Router();
let Expense = require('../model/Expense');
const moment = require('moment');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/expense');

// mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true });

router.get('/expenses', function (request, response) {
  let d1 = request.query.d1;
  let d2 = request.query.d2;
  if (!d1 && !d2) {
    Expense.find({}, function (err, expenses) {
      response.send(expenses);
    }).sort({ date: -1 });
  } else {
    const date2 = d2
      ? moment(d2).format('LLLL')
      : moment(new Date()).format('LLLL');
    const date1 = moment(d1).format('LLLL');
    Expense.aggregate(
      [
        {
          $match: {
            date: { $gte: new Date(date1), $lt: new Date(date2) },
          },
        },
      ],
      function (err, expenses) {
        res.send(expenses);
      }
    );
  }
});

router.post('/expense', function (request, res) {
  let addExpense;
  let addNewDate = new Date();

  let dateOccur = request.body.date;

  dateOccur
    ? (addExpense = new Expense({
        item: request.body.item,
        amount: request.body.amount,
        group: request.body.group,
        date: moment(request.body.date).format('LLLL'),
      }))
    : (addExpense = new Expense({
        item: request.body.item,
        amount: request.body.amount,
        group: request.body.group,
        date: addNewDate,
      }));

  addExpense.save().then((expense) => {
    console.log(
      `The amount of the expense : ${expense.amount},  you spent your money on ${expense.group}`
    );
  });
  res.send(addExpense);
});

router.put('/update', function (req, res) {
  let group1 = req.body.group1;
  let group2 = req.body.group2;

  Expense.findOneAndUpdate(
    { group: group1 },
    { group: group2 },
    function (err, expense) {
      res.send(expense);
    }
  );
});

router.get('/expenses/:group', function (request, response) {
  let groupParam = request.params.group;

  if (request.query.total == true) {
    Expense.aggregate(
      [
        { $match: { group: groupParam } },
        { $group: { _id: groupParam, totalAmount: { $sum: '$amount' } } },
      ],
      function (err, expenses) {
        response.send(expenses);
      }
    );
  } else {
    Expense.find({ group: groupParam }, function (err, expenses) {
      response.send(expenses);
    });
  }
});

module.exports = router;
