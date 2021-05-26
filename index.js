//dependencies
const mysql = require('mysql2/promise'); //using promise wrapper of mysql2
const inquirer = require('inquirer')
const consoleTable = require('console.table');
const util = require('util') //with intention to promisify connection.query api.
let connection;


//create sql connection to database.
const main = async () => {
    console.log('11')
    connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'employees_db'
    });
    init();
}



const init = async () => {
    try {
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
        switch (userInput.action) {
            case 'View all employees':
                console.log('49')
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
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Update employee role':
                updateRole();
                break;
            case 'Delete an employee':
                deleteEmployee();
                break;
            case 'Exit':
                connection.end();
                break;
        };
    } catch (err) {
        console.log(err)
    }
}

const getEmployees = async () => {
    try {
        const query = 'select ' +
        'e.id as EmployeeID, ' +
        'concat(e.first_name , " " , e.last_name) as Name, ' +
        'r.title as Role, ' +
        'r.salary as Salary, ' +
        'd.department_name as Department ' +
        'from ' +
        '((employees_db.employees as e ' +
        'inner join employees_db.roles as r on e.role_id=r.id) ' +
        'inner join employees_db.departments as d on r.department_id=d.id);' 
        const [rows, fields] = await connection.execute(query);
        console.table(rows);
        init();
    } catch (err) {
        console.log(err);
        init();
    }
}

const getDepartments = async () => {
    try {
        const query = 'select * from departments';
        const [rows, fields] = await connection.execute(query);
        console.table(rows);
        init();
    }
    catch (err) {
        console.log(err);
        init();
    }
};

const getRoles = async () => {
    try {
        const query = 'select * from roles';
        const [rows, fields] = await connection.execute(query);
        console.table(rows);
        init();
    }
    catch (err) {
        console.log(err);
        init();
    }
}

const addEmployee = async ()=>{
    try{
        const [roles, fields] = await connection.query('select * from roles')
        const [managers, fields2] = await connection.query('select * from employees')
       
        const employeeData = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'Please enter first name of employee'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Please enter last name of employee'
            },
            {
                name: 'roleId',

                type: 'list',
                choices: roles.map((role) => {return {
                    name: role.title, 
                    value: role.id
                }}),
                message: "What is this Employee's role id?"
            },
            {
                name: 'managerId',
                type: 'list',
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                }),
                message: "What is this Employee's Manager's name?"
            }
        ])
        let result = await connection.query("INSERT INTO employees SET ?", {
            first_name: employeeData.firstName,
            last_name: employeeData.lastName,
            role_id: employeeData.roleId,
            manager_id: employeeData.managerId
        });
        init();
    } catch(err){
        console.log(err)
    }
}

const addDepartment = async ()=>{
    const departmentData = await inquirer.prompt([
        {
            name: 'deptName',
            type: 'input',
            message: 'What is the name of your new department?'
        }
    ])
    let result = await connection.query("insert into departments set?", {
        department_name: departmentData.deptName
    })
    init();
}

const addRole = async ()=>{
    const [departments, fields] = await connection.query('select * from departments')
    //console.log(departments);
    const roleData = await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the name of your new role?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What salary will this role provide?'
        },
        {
            name: 'departmentId',
            type: 'list',
            choices: departments.map((department) => {
                //console.log(department)
                return {
                    name: department.department_name,
                    value: department.id
                }
            }),
            message: 'What department is this role associated with?',
        }
    ]);
    let result = await connection.query("INSERT INTO roles SET ?", {
        title: roleData.title,
        salary: roleData.salary,
        department_id: roleData.departmentId,
    });
    init();

}

main();

//get user inputs based on the list of options like view, add, delete, update etc.

//based on the option invoke each function. - can use switch.

//write out each functions independently. (later consider writing objects and classes.)



