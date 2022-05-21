const mysql = require('mysql2');
const inquirer = requier('inquirer');
const consoleTable = require('console.table');


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
      startApp();
  });

startApp = () => {
    const promptUser = () => {
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
                    'View department budgets',
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
            case 'Exit':
                endApp();
                break;
            default:
                break;
            }
        })
    }
}

viewEmployees = () => {
    const query = 'SELECT * FROM employee';
    db.query(query, function(err, res) {
        if(err) throw err;
        console.log(res.length + ' employees found.');
        console.table('All Employees:', res);
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
    const query = 'SELECT * FROM roles';
    db.query(query, function(err, res) {
        if(err) throw err;
        console.table('All Roles:', res);
        startApp();
    })
}

addEmployee = () => {
    db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;

        inquirer.prompt ([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter employee first name:'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter employee last name:'
            },
            {
                type: 'list',
                name: 'role',
                choices: function() {
                    const roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                },
                message: "What is the employee's role?"
            }
        ]).then(function(answer) {
            let roleId;
            for (let j = 0; j < res.length; j++) {
                if (res[j].title == answer.role) {
                    roleId = res[j].id;
                    console.log(roleId)
                }
            }
            db.query('INSERT INTO employee SET ?'),
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: roleId,
            },
            function (err) {
                if (err) throw err;
                console.log('Employee has been added.');
                startApp();
            }
        })
    })
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
        const sql = `INSERT INTO department (name) VALUES (?)`;
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
            name: 'role',
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
        const params = [answer.role, answer.salary];
        const roleSql = `SELECT name, id FROM department`;
        db.promise().query(roleSql, (err, data) => {
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

                const sql = `INSERT INTO role (title, salary, department_id)
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

