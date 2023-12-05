const mongoose = require('mongoose');

class Database {
  connectionString =
    'mongodb+srv://chandrashekhar0389:2s8AWQDKRd83GIv6@cluster0.wdxzfkw.mongodb.net/noteit?retryWrites=true&w=majority';
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(this.connectionString)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection failed');
      });
  }
}

module.exports = new Database();
