const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./readyupandroll.db');
console.log("hi from DB importer  file!")
module.exports = db;