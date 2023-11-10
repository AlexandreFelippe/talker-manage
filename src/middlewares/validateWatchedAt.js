module.exports = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  const regex = /\d{2}\/\d{2}\/\d{4}/;
  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!regex.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};