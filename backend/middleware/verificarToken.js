const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // TODO 1: Extraer el token del header Authorization (formato: Bearer <token>)

  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(' ')[1]


  // TODO 2: Si no hay token, responder 401 { error: 'Token requerido' }

  if (!token)
    return res.status(401).json({error: "Token requerido"})


  // TODO 3: Verificar el token con jwt.verify() usando JWT_SECRET

  // TODO 4: Si es válido, guardar el payload en req.usuario y llamar next()

  // TODO 5: Si falla, responder 401 { error: 'Token inválido o expirado' }

try {
  const decoded  = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
} catch(err) {
  return res.status(401).json({error: "Token inválido o expirado"})
}
};

module.exports = verificarToken;
