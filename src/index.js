const express = require('express');
const getAllTalkers = require('./talker');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  try {
    const talkers = await getAllTalkers();
    if (talkers) return res.status(HTTP_OK_STATUS).json(talkers);
    return res.status(HTTP_OK_STATUS).json([]);
  } catch (error) {
    console.error('bd não encontrada');
    res.status(400).json({ message: 'bd não encontrada' });
  }
});