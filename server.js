const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const figlet = require('figlet');


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

  db.connect(err => {
      if (err) throw err;
      connected();
  });

  connected = () => {
    figlet('Welcome to the \nEmployee Manager!!', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        startApp();
    });
  }

startApp = () => {
        inquirer.prompt ([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'View all departments',
                    'View all roles',
                    'Add an employee',
                    'Add department',
                    'Add a role',
                    'View employees by department',
                    'Update employee role',
                    'Update employee manager',
                    'Delete department',
                    'Delete role',
                    'Delete employee',
                    'View department budget',
                    'Exit'
                ]
            }
        ]).then((answer) => {
            switch (answer.choice) {
            case 'View all employees':
                viewEmployees();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'View employees by department':
                viewEmpDepts();
                break;
            case 'Update employee role':
                updateRole();
                break;
            case 'Update employee manager':
                updateManager();
                break;
            case 'Delete department':
                deleteDepartment();
                break;
            case 'Delete role':
                deleteRole();
                break;
            case 'Delete employee':
                deleteEmployee();
                break;
            case 'View department budget':
                viewBudget();
                break;
            case 'Exit':
                endApp();
                break;
            default:
                break;
            }
        })
    
}

viewEmployees = () => {
    const query = `SELECT employee.id,
        employee.first_name,
        employee.last_name,
        roles.title,
        department.dept_name AS department,
        roles.salary,
        CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
        LEFT JOIN roles ON employee.role_id = roles.id
        LEFT JOIN department ON roles.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(query, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        startApp();
    })
}

viewDepartments = () => {
    const query = 'SELECT * FROM department';
    db.query(query, function(err, res) {
        if(err) throw err;
        console.table('All Departments:', res);
        startApp();
    })
}

viewRoles = () => {
    const query = `SELECT roles.id,
        roles.title,
        salary,
        department.dept_name AS department
        FROM roles
        INNER JOIN department ON roles.department_id = department.id`;

    db.query(query, function(err, res) {
        if(err) throw err;
        console.table('All Roles:', res);
        startApp();
    })
}

addEmployee = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter employee first name:',
            validate: firstName => {
                if (firstName) {
                    return true;
                } else {
                    console.log('Please enter a first name.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter employee last name:',
            validate: lastName => {
                if (lastName) {
                    return true;
                } else {
                    console.log('Please enter last name');
                    return false;
                }
            }
        },
    ])
    .then(answer => {
        const params = [answer.first_name, answer.last_name]
        const roleSql = `SELECT roles.id, roles.title FROM roles`;

        db.query(roleSql, (err, data) => {
            if (err) throw err;

            const roles = data.map(({ id, title }) => ({ name: title, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roles
                }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);

                const managerSql = `SELECT * FROM employee`;

                db.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + ""+ last_name, value: id}));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                        db.query(sql, params, (err, res) => {
                            if (err) throw err;
                            console.log('Employee has been added')

                            viewEmployees();
                        });
                    });
                });
            });
        });
    });
}

addDepartment = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'new_dept',
            message: 'Which department would you like to add?',
            validate: new_dept => {
                if (new_dept) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }
    ]) .then(answer => {
        const sql = `INSERT INTO department (dept_name) VALUES (?)`;
        db.query(sql, answer.new_dept, (err, res) => {
            if (err) throw err;
            console.log('Added ' + answer.new_dept) + ' to departments.';

            viewDepartments();
        });
    });
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roles',
            message: 'What role do you want to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a role.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?',
            validate: addSalary => {
                if (addSalary) {
                    return true;
                } else {
                    console.log('Please enter a salary.');
                    return false;
                }
            }
        }
    ]).then(answer => {
        const params = [answer.roles, answer.salary];
        const roleSql = `SELECT dept_name, id FROM department`;
        db.query(roleSql, (err, data) => {
            if (err) throw err;

            const dept = data.map(({ name, id }) => ({name: name, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is this role in?',
                    choices: dept
                }
            ]).then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);

                const sql = `INSERT INTO roles (title, salary, department_id)
                            VALUES (?, ?, ?)`;

                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                    console.log('Added' + answer.role + ' to roles.');

                    viewRoles();
                })
            })
        })
    })
};

deleteDepartment = () => {
    const deptSql = `SELECT * FROM department`;

    db.query(deptSql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ dept_name, id }) => ({ name: dept_name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: 'What department do you want to delete?',
                choices: dept
            }
        ])
        .then(deptChoice => {
            const dept = deptChoice.dept;
            const sql = `DELETE FROM department WHERE id = ?`;

            db.query(sql, dept, (err, res) => {
                if (err) throw err;
                console.log('Successfully deleted.');
            
            viewDepartments();
            })
        })
    })
}

deleteRole = () => {
    const roleSql = `SELECT * FROM roles`;

    db.query(roleSql, (err, data) => {
        if (err) throw err;

        const role = data.map(({ title, id }) => ({name: title, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: "What role do you want to delete?",
                choices: role
            }
        ])
        .then(roleChoice => {
            const role = roleChoice.role;
            const sql = `DELETE FROM roles WHERE id = ?`;

            db.query(sql, role, (err, res) => {
                if (err) throw err;
                console.log("Successfully deleted");

                viewRoles();
            })
        })
    })
}

deleteEmployee = () => {
    const empSql = `SELECT * FROM employee`;

    db.query(empSql, (err, data) => {
        if (err) throw err;

        const employee = data.map(({ id, first_name, last_name }) => ({name: first_name + ""+ last_name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee do you  want to delete?',
                choices: employee
            }
        ])
        .then(empChoice => {
            const employee = empChoice.name;
            const sql = `DELETE FROM employee WHERE id = ?`;

            db.query(sql, employee, (err, res) => {
                if (err) throw err;
                console.log('Successfully deleted.');

                viewEmployees();
            })
        })
    })
}

viewEmpDepts = () => {
    console.log('Showing employees by departments...\n');
    const sql = `SELECT employee.first_name, employee.last_name, department.dept_name AS department
    FROM employee
    LEFT JOIN roles ON employee.role_id = roles.id
    LEFT JOIN department ON roles.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        startApp();
    })
}

updateManager = () => {
    const empSql = `SELECT * FROM employee`;
    db.query(empSql, (err, data) => {
        if (err) throw err;

        const employee = data.map(({ id, first_name, last_name }) => ({ name: first_name + ""+ last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee do you want to update?',
                choices: employee
            }
        ])
        .then(empChoice => {
            const employee = empChoice.name;
            const params = [];
            params.push(employee);

            const managerSql = `SELECT * FROM employee`;

            db.query(managerSql, (err, data) => {
                if (err) throw err;

                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + ""+ last_name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managers
                    }
                ])
                .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager);

                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee

                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    db.query(sql, params, (err, res) => {
                        if (err) throw err;
                        console.log("Employee updated!");

                        viewEmployees();
                    })
                })
            })
        })
    })
}

updateRole = () => {
    const empSql = `SELECT * FROM employee`;
    db.query(empSql, (err, data) => {
        if (err) throw err;

        const employee = data.map(({ id, first_name, last_name }) => ({ name: first_name + ""+ last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee do you want to update?',
                choices: employee
            }
        ])
        .then(empChoice => {
            const employee = empChoice.name;
            const params = [];
            params.push(employee);

            const roleSql = `SELECT * FROM roles`;

            db.query(roleSql, (err, data) => {
                if (err) throw err;

                const role = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What new role do you wish to asign?",
                        choices: role
                    }
                ])
                .then(roleChoice => {
                    const role = roleChoice.role;
                    params.push(role);

                    let employee = params[0]
                    params[0] = role
                    params[1] = employee

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    db.query(sql, params, (err, res) => {
                        if (err) throw err;
                        console.log("Employee updated!");

                        viewEmployees();
                    })
                })
            })
        })
    })
}

viewBudget = () => {
    console.log('Showing budget by department...\n');

    const sql = `SELECT department_id AS id, 
        department.dept_name AS department,
        SUM(salary) AS budget
    FROM roles
    LEFT JOIN department ON roles.department_id = department.id GROUP BY department_id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);

        startApp();
    })
}

endApp = () => {
    db.end();
}