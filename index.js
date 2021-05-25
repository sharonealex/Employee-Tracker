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
    database: 'employees_db'
})


const init = async ()=>{
    try{
        let userInput = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: '###Welcome to employee database, what action would you like to perform###',
            choices: ['View all employees',
            'View all departments',
            'View all roles',
            'Add an employee',
            'Add a department',
            'Add a role',
            'Update employee role',
            'Delete an employee',
            'EXIT']
        });
        switch(userInput.action){
            case 'View all employees':
                getEmployees();
                break;
            case 'View all roles':
                getRoles();
                break;
            case 'View all departments':
                getDepartments();
                break;    
            case 'Add an employee':
                addEmployee();
                break;
            case  'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Update employee role':
                updateRole();
                break;
            case  'Delete an employee':
                deleteEmployee();
                break;
            case 'Exit':
                connection.end();
                break;        
        };
    } catch(err){
        console.log(err)
    }
}

 const getEmployees = async ()=>{
     try{
        const query = 'SELECT * FROM employees';
        connection.query(query, (err, res)=>{
            if(err) console.log(err);
            console.table('*******All Employees********', res);
            init();
        });
     } catch (err){
         console.log(err);
         init();
     }   
}

const getDepartments = async()=>{
    try{
        const query = 'select * from departments';
        connection.query(query, (err, res)=>{
            if (err) console.log(err);
            console.table('*******All Roles***********', res);
            init();
        })
    }
    catch(err){
        console.log(err);
        init();
    }
}



//estabilish connection with database, on success initialise the application to start.
connection.connect((err)=>{
if(err) throw err;
init();
})

//get user inputs based on the list of options like view, add, delete, update etc.

//based on the option invoke each function. - can use switch.

//write out each functions independently. (later consider writing objects and classes.)



