
const inquirer = require('inquirer')

const getEmployees = async (connection, init) => {
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
        console.log('/n')
        console.log('#############################################')
        console.log('############### EMPLOYEES TABLE #############')
        console.log('#############################################')
        console.table(rows);
        init();
       
    } catch (err) {
        console.log(err);
        init();
   
    }
}


const addEmployee = async (connection, init) =>{
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

const updateEmployeeRole = async (connection, init) => {  //point to a different role id.
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

const updateEmployeeManager = async (connection, init) => {
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

const viewEmployeesByManager = async (connection, init) => {
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

const deleteEmployees = async (connection, init) => {
    let [deleteEmployeesList, fields2] = await connection.query("select * from employees");
    try {
        let selectedEmployees = await inquirer
            .prompt([
                {
                    name: "employees",
                    type: "checkbox",
                    message: "Choose all the employees to be deleted:",
                    choices: deleteEmployeesList.map((emp) => {
                
                        return {
                            name: emp.first_name + ' ' + emp.last_name,
                            value: emp.id
                        }
                    }),
                },
            ])

        let empIds = selectedEmployees.employees.join(',');
       
        let result = await connection.query('DELETE FROM employees WHERE id IN (' + empIds + ')');
        init();
    } catch (err) {
        console.log({
            errorCode: err.code,
            errorMessage: err.sqlMessage,
            errDescription: 'Update other employees manager and then retry to delete this employee.'
        })
        init()
    }
}

module.exports = {
    getEmployees,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    viewEmployeesByManager,
    deleteEmployees
}