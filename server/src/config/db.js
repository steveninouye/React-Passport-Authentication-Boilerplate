// module sets up connection to database
// connection can also be establised by mysql.createConnection({ host:  user:  password:  database:  })

import mysql from 'mysql';

let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost', // IP of databse
    user: 'exampleUser', // user that has access to database
    password: 'password', // password for user.  User must have password identified by plugin "mysql_native_server"
    database: 'InClassExample' // database name
});

async function executeQuery(sql, args = []) {
    let connection = await getConnection();
    return sendQueryToDB(connection, sql, args);
}

function callProcedure(procedureName, args = []) {
    let placeholders = generatePlaceholders(args);
    let callString = `CALL ${procedureName}(${placeholders});`; // CALL GetChirps();, or CALL InsertChirp(?,?,?);
    return executeQuery(callString, args);
}

async function rows(procedureName, args = []) {
    let resultsets = await callProcedure(procedureName, args);
    return resultsets[0];
}

async function row(procedureName, args = []) {
    let resultsets = await callProcedure(procedureName, args);
    return resultsets[0][0];
}

async function empty(procedureName, args = []) {
    await callProcedure(procedureName, args);
}

function generatePlaceholders(args = []) {
    let placeholders = '';
    if (args.length > 0) {
        for (let i = 0; i < args.length; i++) {
            if (i === args.length - 1) {
                // if we are on the last argument in the array
                placeholders += '?';
            } else {
                placeholders += '?,';
            }
        }
    }
    return placeholders;
}

function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

function sendQueryToDB(connection, sql, args = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, result) => {
            connection.release();
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export { row, rows, empty, executeQuery, generatePlaceholders };
