const express = require('express');
const { getAllTalkers, getTalkerById, writeFile } = require('./talker');
const generateToken = require('./utils/authentication');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const validateToken = require('./middlewares/validateToken');
const validateName = require('./middlewares/validateName');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validateRate');

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

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = generateToken();
  return res.status(HTTP_OK_STATUS).json({ token });
});

app.post(
  '/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    try {
      const talkerList = await getAllTalkers();
      const newId = talkerList.length + 1;
      const newTalker = { id: newId, ...req.body };
      talkerList.push(newTalker);
      await writeFile(talkerList);
      res.status(201).json(newTalker);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },
);

app.put(
  '/talker/:id',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const { id } = req.params;
    const talkerList = await getAllTalkers();
    const talkerIndex = talkerList.findIndex((talker) => talker.id === Number(id));
    if (talkerIndex === -1) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    const newTalker = { id: Number(id), ...req.body };
    talkerList[talkerIndex] = newTalker;
    await writeFile(talkerList);
    return res.status(HTTP_OK_STATUS).json(newTalker);
  },
);

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talkerList = await getAllTalkers();
  const talkerIndex = talkerList.findIndex((talker) => talker.id === Number(id));
  if (talkerIndex === -1) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  talkerList.splice(talkerIndex, 1);
  await writeFile(talkerList);
  return res.status(204).end();
});