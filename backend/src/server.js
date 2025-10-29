import express from 'express';
import cors from 'cors';
import router from './routes.js';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

const PORT = process.env.PORT || 4000;
app.get('/api/ping', (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => console.log(`✅ Backend listening on http://localhost:${PORT}`));