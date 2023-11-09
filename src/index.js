const express = require('express');
const { getAllTalkers, getTalkerById } = require('./talker');
const generateToken = require('./utils/authentication');

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

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await getTalkerById(id);
  if (!talker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/login', (req, res) => {
  const token = generateToken();
  return res.status(HTTP_OK_STATUS).json({ token });
});