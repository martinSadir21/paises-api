
const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// Cargar países desde data.json
let paises = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// GET /paises — todos o filtrados por idioma
app.get('/paises', (req, res) => {
  const idioma = req.query.idioma;
  if (idioma) {
    const filtrados = paises.filter(p =>
      p.idioma.map(i => i.toLowerCase()).includes(idioma.toLowerCase())
    );
    res.json(filtrados);
  } else {
    res.json(paises);
  }
});

// GET /paises/:nombre — país por nombre
app.get('/paises/:nombre', (req, res) => {
  const nombre = req.params.nombre.toLowerCase();
  const pais = paises.find(p => p.pais.toLowerCase() === nombre);
  if (pais) {
    res.json(pais);
  } else {
    res.status(404).json({ mensaje: 'País no encontrado' });
  }
});

// POST /paises — agregar país
app.post('/paises', (req, res) => {
  const nuevoPais = req.body;

  const existe = paises.find(p => p.pais.toLowerCase() === nuevoPais.pais.toLowerCase());
  if (existe) {
    return res.status(400).json({ mensaje: 'El país ya existe' });
  }

  paises.push(nuevoPais);
  fs.writeFileSync('data.json', JSON.stringify(paises, null, 2));
  res.status(201).json({ mensaje: 'País agregado correctamente' });
});

// DELETE /paises/:nombre — eliminar país
app.delete('/paises/:nombre', (req, res) => {
  const nombre = req.params.nombre.toLowerCase();
  const index = paises.findIndex(p => p.pais.toLowerCase() === nombre);
  if (index !== -1) {
    paises.splice(index, 1);
    fs.writeFileSync('data.json', JSON.stringify(paises, null, 2));
    res.json({ mensaje: 'País eliminado correctamente' });
  } else {
    res.status(404).json({ mensaje: 'País no encontrado' });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});