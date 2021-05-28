//dependencies
const mysql = require('mysql2/promise'); //using promise wrapper of mysql2
const inquirer = require('inquirer')
const consoleTable = require('console.table');
const employees = require('./employees');
const roles = require('./roles')
const departments = require('./departments')
let connection;




/**
 * Function to estabilish database connection 
 */
const main = async () => {
    connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'employees_db'
    });
    init();
}

/**
 * Function that initialises the application and allow user actions based on prompts.
 */

const init = async () => {
    try {
        let userInput = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: '###Welcome to employee database, what action would you like to perform###',
            choices: ['View all employees',
                'View all departments',
                'View all roles',
                'View departments budget utilization',
                'Add an employee',
                'Add a department',
                'Add a role',
                'Update employee role',
                'Update employee manager',
                'View employees by manager',
                'Delete employees',
                'Delete roles',
                'Delete departments',
                'EXIT']
        });
        switch (userInput.action) {
            case 'View all employees':
                employees.getEmployees(connection, init);
                break;
            case 'Add an employee':
                employees.addEmployee(connection, init);
                break;    
            case 'Update employee role':
                employees.updateEmployeeRole(connection, init);
                break; 
            case 'Update employee manager':
                employees.updateEmployeeManager(connection, init);
                break;   
            case 'View employees by manager':
                employees.viewEmployeesByManager(connection, init);
                break;   
            case 'Delete employees':
                employees.deleteEmployees(connection, init);
                break;         
            case 'View all roles':
                roles.getRoles(connection, init);
                break;
            case 'Add a role':
                roles.addRole(connection, init);
                break;  
            case 'Delete roles':
                roles.deleteRoles(connection, init);
                break;      
            case 'View all departments':
                departments.getDepartments(connection, init);
                break;
            case 'View departments budget utilization':
                departments.getDepartmentsBudgetUtlization(connection, init);
                break;
            case 'Add a department':
                departments.addDepartment(connection, init);
                break;
            case 'Delete departments':
                departments.deleteDepartments(connection, init);
                break;
            case 'Exit':
                connection.end();
                break;
        };
    } catch (err) {
        console.log(err)
    }
}


main();



