const { Router } = require('express');
const router = Router();
const usersService = require('../services/users.service');

router.get('/', async (req, res) => {
  try {
    const users = await usersService.find();
    return res.status(200).json(users);
  }
  catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});

router.get('/:id/card', async (req, res) => {
  try {
    const { id } = req.params;
    await usersService.generatePdf(id);
    return res.status(200).send();
  }
  catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});

router.get('/:id/:file', async (req, res) => {
  try {
    const { id, file } = req.params;
    const fileData = await usersService.findFile(id, file);
    if(file === 'photo'){
      res.setHeader('Content-Type', 'image/png');
    }
    else {
      res.setHeader('Content-Type', 'application/pdf');
    }
    return res.status(200).send(fileData);
  }
  catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    await usersService.insert(req.body, req.files);
    return res.status(201).send();
  }
  catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.update(id, req.body);
    return res.status(200).json(user);
  }
  catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.remove(id)
    return res.status(200).json(user);
  }
  catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});

module.exports = router;