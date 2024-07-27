import postgres from 'postgres';

const sql = postgres('postgres://postgres:mypassword@db:5432/example', {
    host: 'db',
    port: 5432,
    database: 'example',
    username: 'postgres',
    password: 'mypassword',
});

export default sql;