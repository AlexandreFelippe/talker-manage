const fs = require('fs').promises;
const { join } = require('path');

const path = '/talker.json';

const getAllTalkers = async () => {
  try {
    const talkers = await fs.readFile(join(__dirname, path), 'utf-8');
    return JSON.parse(talkers);
  } catch (error) {
    console.error('db não encontrada');
  }
};

const getTalkerById = async (id) => {
  const talkers = await getAllTalkers();
  const selectedTalker = talkers.find((talker) => talker.id === Number(id));
  return selectedTalker;
};

const writeFile = async (talkers) => {
  await fs.writeFile(join(__dirname, path), JSON.stringify(talkers));
};

module.exports = {
  getAllTalkers,
  getTalkerById,
  writeFile,
};