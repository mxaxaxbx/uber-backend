import * as mysql from 'like-mysql';

const db = mysql.createPool({
    host: '',
    user: '',
    password: '',
    database: '',
    port: 3306,
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true,
    debug: false,
    multipleStatements: true,
    dateStrings: true,
    timezone: 'Z'
});

db.waitConnection();

export { db };
