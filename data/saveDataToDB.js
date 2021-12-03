const expenses = require('./expenses');
const Expense = require('../model/Expense');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/expense');
// mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true });

for (expense of expenses) {
  let expenses = new Expense({
    item: expense.item,
    amount: expense.amount,
    date: expense.date,
    group: expense.group,
  });
  expenses.save();
}
