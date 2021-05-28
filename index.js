//dependencies
const mysql = require('mysql2/promise'); //using promise wrapper of mysql2
const inquirer = require('inquirer')
const consoleTable = require('console.table');
const util = require('util'); //with intention to promisify connection.query api.
const { listenerCount } = require('events');
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
                'Update employee manager',
                'View employees by manager',
                'Delete employees',
                'Delete roles',
                'Delete departments',
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
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'View employees by manager':
                viewEmployeesByManager();
                break;
            case 'Delete employees':
                deleteEmployees();
                break;
            case 'Delete roles':
                deleteRoles();
                break;
            case 'Delete departments':
                deleteDepartments();
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
        const query = 'SELECT  d.id,  d.department_name, SUM(salary) as utilized_budget ' +
            'FROM employees e ' +
            'JOIN roles r ON e.role_id = r.Id ' +
            'JOIN departments d ON d.id = r.department_id ' +
            'GROUP BY d.department_name;'
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
        const query = 'select ' +
            'r.id as RoleID, ' +
            'r.title as Title, ' +
            'r.salary as Salary, ' +
            'd.department_name as Department ' +
            'from ' +
            'employees_db.roles as r ' +
            'inner join employees_db.departments as d on r.department_id=d.id';

        const [rows, fields] = await connection.execute(query);
        console.table(rows);
        init();
    }
    catch (err) {
        console.log(err);
        init();
    }
}

const addEmployee = async () => {
    try {
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
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                }),
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
    } catch (err) {
        console.log(err)
    }
}

const addDepartment = async () => {
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

const addRole = async () => {
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

const updateEmployeeRole = async () => {  //point to a different role id.
    let [employees, fields] = await connection.query("select * from employees");
    console.table(employees)

    let selectedEmployee = await inquirer.prompt([
        {
            name: 'employeeName',
            type: 'list',
            choices: employees.map((emp) => {
                return {
                    name: emp.first_name + ' ' + emp.last_name,
                    value: emp.id
                }
            }),
            message: 'please choose an employee to update role?'
        }
    ]);

    let [roles, fields2] = await connection.query("select * from roles");

    let selectedRole = await inquirer.prompt([
        {
            name: 'roleTitle',
            type: 'list',
            choices: roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                }
            }),
            message: 'please choose the new role to be updated'
        }
    ])

    let result = await connection.query("UPDATE employees SET ? WHERE ?",
        [
            { role_id: selectedRole.roleTitle },
            { id: selectedEmployee.employeeName }
        ]);
    console.log('role was updated successfully')
    init();

}

const updateEmployeeManager = async () => {
    let [employees, fields] = await connection.query("select * from employees");

    let selectedEmployee = await inquirer.prompt([
        {
            name: 'employeeName',
            type: 'list',
            choices: employees.map((emp) => {
                return {
                    name: emp.first_name + ' ' + emp.last_name,
                    value: emp.id
                }
            }),
            message: 'please choose an employee to update their manager?'
        }
    ]);

    let [managers, fields2] = await connection.query("select * from employees");

    let selectedManager = await inquirer.prompt([
        {
            name: 'manager',
            type: 'list',
            choices: managers.map((manager) => {
                return {
                    name: manager.first_name + ' ' + manager.last_name,
                    value: manager.id
                }
            }),
            message: 'please choose the new manager to be updated'
        }
    ])

    let result = await connection.query("UPDATE employees SET ? WHERE ?",
        [
            { manager_id: selectedManager.manager },
            { id: selectedEmployee.employeeName }
        ]);
    console.log('manager was updated successfully')
    init();
}

const viewEmployeesByManager = async () => {


    let query = 'SELECT ' +
        ' e.id as Employee_ID, ' +
        'concat(e.first_name , " " , e.last_name) as Employee_Name, ' +
        'concat(m.first_name , " " , m.last_name) as Manager_Name ' +
        'FROM ' +
        'employees_db.employees as e ' +
        'left join employees_db.employees as m on e.manager_id=m.id;'

    const [rows, fields] = await connection.execute(query);
    console.table(rows);
    init();
}

const deleteEmployees = async () => {
    let [deleteEmployeesList, fields2] = await connection.query("select * from employees");
    console.log(deleteEmployeesList)
    try {
        let selectedEmployees = await inquirer
            .prompt([
                {
                    name: "employees",
                    type: "checkbox",
                    message: "Choose all the employees to be deleted:",
                    choices: deleteEmployeesList.map((emp) => {
                        console.log(emp)
                        return {
                            name: emp.first_name + ' ' + emp.last_name,
                            value: emp.id
                        }
                    }),
                },
            ])

        let empIds = selectedEmployees.employees.join(',');
        console.log('DELETE FROM employees WHERE id IN (' + empIds + ')')
        let result = await connection.query('DELETE FROM employees WHERE id IN (' + empIds + ')');
        init();
    } catch (err) {
        console.log({
            errorCode: err.code,
            errorMessage: err.sqlMessage,
            errDescription: 'Cannont delete employee as he is a manager'
        })
        console.log('****ACTION:Update other employees manager and then retry to delete this employee.')
        init()
    }
}

const deleteRoles = async () => {
    try {
        let [deleteRolesList, fields2] = await connection.query("select * from roles");
        console.log(deleteRolesList)
        let selectedRoles = await inquirer
            .prompt([
                {
                    name: "roles",
                    type: "checkbox",
                    message: "Choose all the roles to be deleted:",
                    choices: deleteRolesList.map((role) => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    }),
                },
            ])
        let roleIds = selectedRoles.roles.join(',');
        let result = await connection.query('DELETE FROM roles WHERE id IN (' + roleIds + ')');
        init();

    } catch (err) {
        console.log({
            errorCode: err.code,
            errorMessage: err.sqlMessage,
            errDescription: '****ACTION:Update  employees roles to a different one ,retry to delete this role.'
        })
        init()
    }

}

const deleteDepartments = async () => {
    try {
        let [deleteDepartmentsList, fields2] = await connection.query("select * from departments");
        let selectedDepartments = await inquirer
            .prompt([
                {
                    name: "departments",
                    type: "checkbox",
                    message: "Choose all the departments to be deleted:",
                    choices: deleteDepartmentsList.map((dept) => {
                        return {
                            name: dept.department_name,
                            value: dept.id
                        }
                    }),
                },
            ])

        let deptIds = selectedDepartments.departments.join(',');
        let result = await connection.query('DELETE FROM departments WHERE id IN (' + deptIds + ')');
        init();

    } catch (err) {
        console.log({
            errorCode: err.code,
            errorMessage: err.sqlMessage,
            errDescription: '****ACTION:Update  employees roles to a different one ,retry to delete this dept.'
        })
        init()
    }

}

main();



