const inquirer = require('inquirer')

/**
 * Function to view all the roles in the company across departments
 * @param {*} connection 
 * @param {*} init 
 */
const getRoles = async (connection, init) => {
    try {
        const query = 'select ' +
            'r.id as RoleID, ' +
            'r.title as Title, ' +
            'r.salary as Salary, ' +
            'd.department_name as Department ' +
            'from ' +
            'employees_db.roles as r ' +
            'inner join employees_db.departments as d on r.department_id=d.id';
            console.log(query)

        const [rows, fields] = await connection.execute(query);
        console.log('/n')
        console.log('#############################################')
        console.log('############### ROLES TABLE #############')
        console.log('#############################################')
        console.table(rows);
        init();
    }
    catch (err) {
        console.log(err);
        init();
    }
}

/**
 * Function to add a new role to an existing department
 * @param {*} connection 
 * @param {*} init 
 */
const addRole = async (connection, init) => {
    const [departments, fields] = await connection.query('select * from departments')
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

/**
 * Function to delete an existing role based on user choice.
 * @param {*} connection 
 * @param {*} init 
 */
const deleteRoles = async (connection, init) => {
    try {
        let [deleteRolesList, fields2] = await connection.query("select * from roles");
      
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

module.exports = {
    getRoles,
    addRole,
    deleteRoles
}