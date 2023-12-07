const express = require('express');
const bodyParser = require('body-parser');
require('./mongooseProvider');

var cors = require('cors');

const fs = require('fs');

// create our express app
const app = express();
// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// route
const routes = require('./Routes/Route');
app.use('/', routes);

//start server
const PORT = process.env.PORT || 5800;
app.listen(PORT, () => {
  console.log('listeniing at port:' + PORT);
});
