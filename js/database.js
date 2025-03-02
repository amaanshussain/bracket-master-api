const mysql2 = require('mysql2/promise');

const dotenv = require('dotenv');
dotenv.config();

const pool = mysql2.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function querydb(sql, values) {
    const connection = await pool.getConnection();
    const data = await connection.query(sql, values).then(([rows, fields]) => {
        return rows;
    });
    connection.release();
    return data;
}

module.exports = { querydb };