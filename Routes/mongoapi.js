const express = require('express');
const accountRoutes = express.Router();

const baseUrl = '/rest/api';

function DMLResponse(msg, data = null) {
  return { success: true, msg, data };
}
function getCurrentDate() {
  return { modifiedOn: new Date() };
}
accountRoutes.post(`${baseUrl}/add`, async (req, res) => {
  let input = req.body || {};
  if (req.headers.usersession) {
    const { username } = JSON.parse(req.headers.usersession);
    input = { ...input, username, ...getCurrentDate() };
  }
  const model = new req.model(input);

  const response = await model.save();
  res.send(DMLResponse('data added successfully', response));
});

accountRoutes.post(`${baseUrl}/findone`, async (req, res) => {
  let include = {};
  if (req.headers.include) {
    include = { ...include, ...JSON.parse(req.headers.include) };
  }

  const todo = await req.model.findOne(req.body, include);
  res.json(todo);
});

accountRoutes.post(`${baseUrl}/deletemany`, async (req, res) => {
  let input = req.body || {};

  if (req.headers.usersession) {
    let { username } = JSON.parse(req.headers.usersession);
    input = { ...input, username };
  }

  const deletedTodo = await req.model.deleteMany(input);
  res.json(deletedTodo);
});

accountRoutes.get(`${baseUrl}/list`, async (req, res) => {
  let input = {};

  if (req.headers.usersession) {
    const { username } = JSON.parse(req.headers.usersession);
    input = { ...input, username };
  }
  let include = {};
  if (req.headers.include) {
    include = { ...include, ...JSON.parse(req.headers.include) };
  }
  const result = await req.model.find(input, include);

  res.send(result);
});

accountRoutes.post(`${baseUrl}/query`, async (req, res) => {
  let input = req.body || {};

  if (req.headers.usersession) {
    let { username } = JSON.parse(req.headers.usersession);
    input = { ...input, username };
  }
  let include = {};
  if (req.headers.include) {
    include = { ...include, ...JSON.parse(req.headers.include) };
  }
  const result = await req.model.find(input, include);

  res.send(result);
});

accountRoutes.get(`${baseUrl}/get/:id`, async (req, res) => {
  const todo = await req.model.findById(req.params.id);
  res.json(todo);
});

// Update - using Put method
accountRoutes.put(`${baseUrl}/put/:id`, async (req, res) => {
  let bodydata = req.body;
  bodydata = { ...bodydata, ...getCurrentDate() };
  delete body.id;

  const updatedTodo = await req.model.findByIdAndUpdate(
    req.params.id,
    bodydata,
    { new: true }
  );
  res.json(updatedTodo);
});

// Patch - using Patch method
accountRoutes.patch(`${baseUrl}/patch/:id`, async (req, res) => {
  let bodydata = req.body;
  bodydata = { ...bodydata, ...getCurrentDate() };
  delete bodydata.id;

  const updatedTodo = await req.model.findByIdAndUpdate(
    req.params.id,
    bodydata,
    { new: true }
  );
  res.json(updatedTodo);
});

//delete - using delete method
accountRoutes.delete(`${baseUrl}/delete/:id`, async (req, res) => {
  const deletedTodo = await req.model.findByIdAndDelete(req.params.id);
  res.json(deletedTodo);
});

module.exports = accountRoutes;
