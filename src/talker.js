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

module.exports = getAllTalkers;