const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  item: String,
  amount: Number,
  date: Date,
  group: String,
});

const Expense = mongoose.model('expense', expenseSchema);

module.exports = Expense;
