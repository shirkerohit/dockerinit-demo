import express from 'express';
import bodyParser from 'body-parser';
import sql from './db/db.js';  // Import the SQL module

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello world : Express-pgsql-docker-init demo!');
})

// Route to create a table if not exists
app.post('/create-table', async (req, res) => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE
            );
        `;
        await sql.unsafe(createTableQuery);
        res.send('Table "users" created or already exists.');
    } catch (error) {
        console.error('Error creating table:', error);
        res.status(500).send('Error creating table.');
    }
});

// Route to list all tables
app.get('/list-tables', async (req, res) => {
    try {
        const result = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `;
        res.json(result);
    } catch (error) {
        console.error('Error listing tables:', error);
        res.status(500).send('Error listing tables.');
    }
});

// Route to insert a value
app.post('/create-user', async (req, res) => {
    const { name, email } = req.body;
    try {
        await sql`
            INSERT INTO users (name, email) 
            VALUES (${name}, ${email});
        `;
        res.send('Value inserted successfully.');
    } catch (error) {
        console.error('Error inserting value:', error);
        res.status(500).send('Error inserting value.');
    }
});

// Route to delete a value by id
app.get('/delete-user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql`
            DELETE FROM users 
            WHERE id = ${id};
        `;
        res.send('Value deleted successfully.');
    } catch (error) {
        console.error('Error deleting value:', error);
        res.status(500).send('Error deleting value.');
    }
});

// Route to list all values
app.get('/get-users', async (req, res) => {
    try {
        const result = await sql`
            SELECT * FROM users;
        `;
        res.json(result);
    } catch (error) {
        console.error('Error listing values:', error);
        res.status(500).send('Error listing values.');
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
