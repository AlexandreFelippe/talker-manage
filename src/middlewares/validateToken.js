module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16 && typeof token !== 'string') {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};