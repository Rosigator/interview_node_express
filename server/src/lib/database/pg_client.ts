import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pg_client = new Client({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

export default pg_client;