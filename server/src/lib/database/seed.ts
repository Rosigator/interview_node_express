import fs from 'node:fs/promises';
import pg_client from './pg_client';

async function seedDatabase() {
    try {
        await pg_client.connect();
        const sql = await fs.readFile('./src/lib/database/schema.sql', 'utf-8');
        await pg_client.query(sql);
        console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await pg_client.end();
    }
}

await seedDatabase();