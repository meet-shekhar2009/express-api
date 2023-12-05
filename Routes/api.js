const express = require('express');
const mongoose = require('mongoose');
const initdb = require('../mongooseProvider');

const accountRoutes = express.Router();
const fs = require('fs');

const baseUrl = '/api';
// util functions

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});
const User = mongoose.model('practice', userSchema);

function getModifyOn() {
  return new Date().getTime();
}

const saveAccountData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(process.env.databasePath, stringifyData);
};

const getAccountData = () => {
  const jsonData = fs.readFileSync(process.env.databasePath);
  return JSON.parse(jsonData);
};

function DMLResponse(msg) {
  return { success: true, msg };
}
// reading the data
accountRoutes.get(baseUrl, (req, res) => {
  fs.readFile(process.env.databasePath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    res.send(JSON.parse(data));
  });
});

accountRoutes.post(`${baseUrl}/add`, (req, res) => {
  var existAccounts = getAccountData();
  const newAccountId = Math.floor(100000 + Math.random() * 900000);

  existAccounts[newAccountId] = { ...req.body, modifiedOn: getModifyOn() };

  saveAccountData(existAccounts);
  res.send(DMLResponse('data added successfully'));
});

// Read - get all accounts from the json file
accountRoutes.get(`${baseUrl}/list`, (req, res) => {
  const accounts = getAccountData();
  res.send(accounts);
});
accountRoutes.get(`${baseUrl}/mongo`, async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

accountRoutes.get(`${baseUrl}/:id`, (req, res) => {
  const accounts = getAccountData();
  res.send(accounts[req.params['id']]);
});

// Update - using Put method
accountRoutes.put(`${baseUrl}/put/:id`, (req, res) => {
  var existAccounts = getAccountData();
  fs.readFile(
    process.env.databasePath,
    'utf8',
    (err, data) => {
      const accountId = req.params['id'];
      existAccounts[accountId] = req.body;

      saveAccountData(existAccounts);
      res.send(DMLResponse(`record with id ${accountId} has been updated`));
    },
    true
  );
});

// Patch - using Patch method
accountRoutes.patch(`${baseUrl}/patch/:id`, (req, res) => {
  var existAccounts = getAccountData();
  fs.readFile(
    process.env.databasePath,
    'utf8',
    (err, data) => {
      const accountId = req.params['id'];
      const existingData = existAccounts[accountId];
      const result = {};
      Object.entries(req.body).forEach(([propName, Value]) => {
        existingData[propName] = Value;
      });

      saveAccountData(existAccounts);
      res.send(DMLResponse(`record with id ${accountId} has been updated`));
    },
    true
  );
});

//delete - using delete method
accountRoutes.delete(`${baseUrl}/delete/:id`, (req, res) => {
  fs.readFile(
    process.env.databasePath,
    'utf8',
    (err, data) => {
      var existAccounts = getAccountData();

      const userId = req.params['id'];

      delete existAccounts[userId];
      saveAccountData(existAccounts);
      res.send(DMLResponse(`record with id ${userId} has been deleted`));
    },
    true
  );
});

module.exports = accountRoutes;
