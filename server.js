const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Conexión a MongoDB
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

client.connect()
    .then(() => {
        db = client.db('quizDB');
        console.log('Conexión a MongoDB establecida');
    })
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Función para registrar visitas
function logVisit(req) {
    const visitorIp = req.ip;
    const timestamp = new Date().toISOString();
    const logEntry = `Visita: ${visitorIp} - ${timestamp}\n`;

    fs.appendFile('visitas.log', logEntry, (err) => {
        if (err) {
            console.error('Error al registrar la visita:', err);
        } else {
            console.log('Visita registrada:', visitorIp);
        }
    });
}

// Middleware para registrar cada visita
app.use((req, res, next) => {
    logVisit(req);
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pagina_de_inicio.html'));
});

// Ruta para guardar respuestas
app.post('/guardar-respuestas', (req, res) => {
    const { nombre, respuestas, imagenes, calificacion } = req.body;

    db.collection('resultados').insertOne({
        nombre,
        respuestas,
        imagenes,
        calificacion,
        fecha: new Date()
    })
        .then(() => {
            res.json({ mensaje: 'Resultados guardados correctamente' });
        })
        .catch(err => {
            console.error('Error al guardar en MongoDB:', err);
            res.status(500).json({ error: 'Error al guardar los datos' });
        });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

