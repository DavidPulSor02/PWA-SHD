const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

webpush.setVapidDetails(
    'mailto:cristian.flores@utcv.edu.mx',
    process.env.VAPID_PUBLIC,
    process.env.VAPID_PRIVATE
);

let suscripciones = []; // Puede ser una bd el dia de mañana 

app.post('/api/subscribe', (req, res) => {
    const sub = req.body;
    const yaExiste = suscripciones.some((s) => s.endpoint === sub.endpoint);
    if (!yaExiste) suscripciones.push(sub);
    console.log('Suscripciones:', suscripciones.length);
    res.status(201).json({ ok: true });
});

app.post('/api/push', async (req, res) => {
    const payload = JSON.stringify({
        title: req.body.title,
        body: req.body.body
    });

    for (const sub of suscripciones) {
        try {
            await webpush.sendNotification(sub, payload);
        } catch (err) {
            if (err.statusCode === 404 || err.statusCode === 410) {
                suscripciones = suscripciones.filter((s) => s.endpoint !== sub.endpoint);
            }
        }
    }
    res.json({ enviadas: suscripciones.length });
});

app.use('/server', (req, res) => res.sendStatus(404));
app.use(express.static(path.join(__dirname, '..')));

app.listen(3000, () => console.log('Servidor Activo :  http://localhost:3000'));