const express = require('express');
const accountRoutes = express.Router();

const baseUrl = '/rest/api';

function DMLResponse(msg) {
  return { success: true, msg };
}

accountRoutes.post(`${baseUrl}/add`, async (req, res) => {
  console.log(req.body);
  const model = new req.model(req.body);
  await model.save();
  res.send(DMLResponse('data added successfully'));
});

accountRoutes.post(`${baseUrl}/findone`, async (req, res) => {
  const todo = await req.model.findOne(req.body);
  res.json(todo);
});

accountRoutes.get(`${baseUrl}/list`, async (req, res) => {
  const result = await req.model.find({});

  res.send(result);
});

accountRoutes.get(`${baseUrl}/get/:id`, async (req, res) => {
  const todo = await req.model.findById(req.params.id);
  res.json(todo);
});

// Update - using Put method
accountRoutes.put(`${baseUrl}/put/:id`, async (req, res) => {
  const bodydata = req.body;
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
  const bodydata = req.body;
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
