import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pg_client from './lib/database/pg_client';

dotenv.config();
await pg_client.connect();
const PORT = process.env.APP_PORT || 3000;

const app = express();
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname,req,res,responseTime',
      messageFormat: '{req.method} {req.url} {res.statusCode} in {responseTime}ms',
      translateTime: 'HH:MM:ss'
    }
  }
});

app.use(express.json());
app.use(pinoHttp({ logger }));
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const shutdown = async () => {
  console.log('Cerrando conexión a PostgreSQL...');
  await pg_client.end();
  server.close(() => {
    console.log('Servidor Express cerrado.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);