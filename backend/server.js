const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const apiKey = 'TU_API_KEY_DE_PRUEBA'; // Reemplaza con tu API Key
const commerceCode = '597055555532'; // Código de comercio de prueba

// Ruta para crear una transacción
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

// Ruta para confirmar una transacción
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

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));