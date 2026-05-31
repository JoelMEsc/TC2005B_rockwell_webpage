const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.registro = async (req, res) => {
  const { name, surname, email, password, country, role, nickname} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password,10);

    const usuario = await Usuario.create({
        name,
        surname,
        email,
        password: hashedPassword,
        country,
        role,
        nickname,
        max_score: 0,
        is_admin: false,
        registration_date: new Date(),
        active: true
    })
  
    res.status(201).json({mensaje: "Usuario creado correctamente"})

  } catch (err) {
    res.status(400).json({ error: 'Error al crear usuario' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({where: {email}})

    if (!usuario) return res.status(401).json({error: "Credenciales inválidas"})

    const passwordValido = await bcrypt.compare(password, usuario.password)

    if (!passwordValido)
      return res.status(401).json({error: "Credenciales inválidas"})

    if (!usuario.active)
      return res.status(403).json({error: "Cuenta desactivada"})

    // Firma token con id de usuario, correo y si es admin
    const token = jwt.sign(
      {user_id: usuario.user_id, email: usuario.email, is_admin: usuario.is_admin}, 
      process.env.JWT_SECRET, 
      {expiresIn: '1d'}
    )
    // Token saber si es admin, usado para frontend
    res.json({ token, is_admin: usuario.is_admin })

  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};