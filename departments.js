const inquirer = require('inquirer')



/**
 * Function to view all the department details with name and utilized budget.
 * @param {} connection 
 * @param {*} init 
 */
 const getDepartments = async (connection, init) => {
    try {
        const query = 'SELECT * from departments'
        const [rows, fields] = await connection.execute(query);
        console.log('###############################################')
        console.log('############### DEPARTMENTS TABLE #############')
        console.log('###############################################')
        console.table(rows);
        init();
    }
    catch (err) {
        console.log(err);
        init();

    }
};

/**
 * Function to view all the department details with name and utilized budget.
 * @param {} connection 
 * @param {*} init 
 */
const getDepartmentsBudgetUtlization = async (connection, init) => {
    try {
        const query = 'SELECT  d.id,  d.department_name, SUM(salary) as utilized_budget ' +
            'FROM employees e ' +
            'JOIN roles r ON e.role_id = r.Id ' +
            'JOIN departments d ON d.id = r.department_id ' +
            'GROUP BY d.department_name;'
        const [rows, fields] = await connection.execute(query);
        console.log('############################################################')
        console.log('############### DEPARTMENTS BUDGET UTILIZATION #############')
        console.log('############################################################')
        console.table(rows);
        init();
    }
    catch (err) {
        console.log(err);
        init();

    }
};

/**
 * Function to add more departments by providing the required database attributes.
 * @param {} connection 
 * @param {*} init 
 */

const addDepartment = async (connection, init) => {
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

/**
 * Fuction to delete departments, based on selected user input of department names
 * @param {*} connection 
 * @param {*} init 
 */
 const deleteDepartments = async (connection, init) => {
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

module.exports = {
    deleteDepartments,
    addDepartment,
    getDepartments,
    getDepartmentsBudgetUtlization
}