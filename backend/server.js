const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const db = require('./bd'); // Importar la conexión a la base de datos
const app = express();
app.use(express.json());

// Configuración de Webpay
const apiKey = 'TU_API_KEY_DE_PRUEBA'; // Reemplaza con tu API Key
const commerceCode = '597055555532'; // Código de comercio de prueba

// Ruta para registrar un usuario
app.post('/registrar', (req, res) => {
    const { nombre_usuario, correo, contrasena, direccion, telefono } = req.body;

    // Encriptar la contraseña
    bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) {
            console.error('Error al encriptar la contraseña:', err);
            return res.status(500).send('Error en el servidor');
        }

        // Insertar el usuario en la base de datos
        const query = `
            INSERT INTO usuarios (nombre_usuario, correo, contrasena, direccion, telefono)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(query, [nombre_usuario, correo, hash, direccion, telefono], (err, result) => {
            if (err) {
                console.error('Error al insertar en la base de datos:', err);
                return res.status(500).send('Error en el servidor');
            }
            res.send('Usuario registrado exitosamente');
        });
    });
});

// Ruta para crear una transacción con Webpay
app.post('/crear-transaccion', async (req, res) => {
    try {
        const { monto, ordenCompra, sessionId, returnUrl } = req.body;

        const response = await axios.post(
            'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions',
            {
                buy_order: ordenCompra,
                session_id: sessionId,
                amount: monto,
                return_url: returnUrl,
            },
            {
                headers: {
                    'Tbk-Api-Key-Id': commerceCode,
                    'Tbk-Api-Key-Secret': apiKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para confirmar una transacción con Webpay
app.post('/confirmar-transaccion', async (req, res) => {
    try {
        const { token } = req.body;

        const response = await axios.put(
            `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`,
            {},
            {
                headers: {
                    'Tbk-Api-Key-Id': commerceCode,
                    'Tbk-Api-Key-Secret': apiKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});