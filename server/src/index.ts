import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error']
});

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

app.get('/', async (req, res) => {
  
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  await pool.end();
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Servidor Express cerrado.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);