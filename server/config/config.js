//=========================================
//  Puerto
//=========================================
process.env.PORT = process.env.PORT || 3000;

//=========================================
//  Entorno
//=========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================================
//  Base de datos
//=========================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/db_cafe';
} else {
    urlDB = 'mongodb://cafe-user:somWMUAFkO7y0jD1@cluster0.imb42.mongodb.net/db_cafe';
}

process.env.URLDB = urlDB;