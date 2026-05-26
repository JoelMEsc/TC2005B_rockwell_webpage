const esAdmin = (req, res, next) => {
  if (!req.usuario?.is_admin) {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
};

module.exports = esAdmin;