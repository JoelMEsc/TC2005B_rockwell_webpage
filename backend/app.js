require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const juegoRoutes = require('./routes/juegoRoutes');
const rondaRoutes = require('./routes/rondaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/juegos', juegoRoutes);
app.use('/api/rondas', rondaRoutes);

app.use('/secure-factory-game', (req, res, next) => {
  // Brotli (.br)
  if (req.url.endsWith('.js.br')) {
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'application/javascript');
  } else if (req.url.endsWith('.wasm.br')) {
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'application/wasm');
  } else if (req.url.endsWith('.data.br')) {
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'application/octet-stream');
  }
  else if (req.url.endsWith('.js.gz')) {
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/javascript');
  } else if (req.url.endsWith('.wasm.gz')) {
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/wasm');
  } else if (req.url.endsWith('.data.gz')) {
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'application/octet-stream');
  }
  next();
});

app.use('/secure-factory-game', express.static(path.join(__dirname, 'public/secure-factory-game')));

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  });
