const express = require('express');
const router = express.Router();
const utils = require('./utils');
const { dirname } = require('path');
const mongoose = require('mongoose');

const apiRoutes = require('./api.js');
const mongoApiRoutes = require('./mongoapi.js');

const dbPath = './db/';
const appDir = dirname(require.main.filename);

const Schema = new mongoose.Schema(
  {},
  { strict: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
Schema.virtual('id', {
  id: this.id,
});

function model() {
  const models = {};
  return (dbname) => {
    if (!models[dbname]) {
      models[dbname] = mongoose.model(dbname, Schema);
    }
    return models[dbname];
  };
}

router.use((req, res, next) => {
  console.log(req);
  if (!req.headers.dbname) {
    res.send(`Error: dbName name is not supplied to headers`);
  } else {
    if (!req.headers.dbtype) {
      res.send(
        `Error: dbtype name is not supplied to headers,should be mongo | json`
      );
    }
    if (req.headers.dbtype === 'mongo') {
      req.model = model()(req.headers.dbname);
    } else {
      const files = utils.getFiles(dbPath);
      const dbName = `${req.headers.dbname}.json`;
      if (!files.some((k) => k == dbName)) {
        utils.createFile(`${appDir}/db/${dbName}`);
      }

      const databasePath = './db/' + dbName;
      process.env.databasePath = databasePath;
    }
  }

  next();
});
router.use(apiRoutes);
router.use(mongoApiRoutes);

module.exports = router;
