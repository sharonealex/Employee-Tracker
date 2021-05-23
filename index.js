//dependencies
const mysql = require('mysql');
const inquirer = require('inquirer')
const consoleTable = require('console.table');
const util = require('util') //with intention to promisify connection.query api.


//create sql connection to database.
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'employee_DB'
})

//estabilish connection with database, on success initialise the application to start.
connection.connect((err)=>{
if(err) throw err;
init();
})