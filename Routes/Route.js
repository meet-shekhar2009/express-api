const express = require('express');
const router = express.Router();
const utils = require('./utils');
const { dirname } = require('path');

const apiRoutes = require('./api.js');

const dbPath = './db/';
const appDir = dirname(require.main.filename);

router.use((req, res, next) => {
  if (!req.headers.dbname) {
    res.send(`Error: dbName name is not supplied to headers`);
  } else {
    const files = utils.getFiles(dbPath);
    const dbName = `${req.headers.dbname}.json`;
    if (!files.some((k) => k == dbName)) {
      utils.createFile(`${appDir}/db/${dbName}`);
    }
    const databasePath = './db/' + dbName;
    process.env.databasePath = databasePath;
  }

  next();
});
router.use(apiRoutes);
module.exports = router;
