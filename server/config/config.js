//=========================================
//  Puerto
//=========================================
process.env.PORT = process.env.PORT || 3000;

//=========================================
//  Entorno
//=========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================================
//  Vencimiento del Token
//=========================================
// 60 segundos
// 60 segundos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h'; //60 * 60 * 24 * 30;

//=========================================
//  SEED de autenticacion
//=========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=========================================
//  Base de datos
//=========================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/db_cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=========================================
//  Google Client ID
//=========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '319369008377-lvvd6nl0i4nmb5d68ipm9ai6jpfo54eu.apps.googleusercontent.com';