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

  db.connect(function(err) {
      if (err) throw err;
      startApp();
  });

function startApp() {
    inquirer.prompt ({
        name: 'choice',
        type: 'list',
        message: 'Welcome to Employee Tracker! What would you like to do?',
        choices: [
            'View all employees',
            'View all departments',
            'View all roles',
            'Add an employee',
            'Add department',
            'Add a role',
            'Exit'
        ]
    }).then(function (answer) {
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
            case 'Exit':
                endApp();
                break;
            default:
                break;
        }
    })
}

function viewEmployees() {
    const query = 'SELECT * FROM employee';
    db.query(query, function(err, res) {
        if(err) throw err;
        console.log(res.length + ' employees found.');
        console.table('All Employees:', res);
        startApp();
    })
}

function viewDepartments() {
    const query = 'SELECT * FROM department';
    db.query(query, function(err, res) {
        if(err) throw err;
        console.table('All Departments:', res);
        startApp();
    })
}

function viewRoles() {
    const query = 'SELECT * FROM roles';
    db.query(query, function(err, res) {
        if(err) throw err;
        console.table('All Roles:', res);
        startApp();
    })
}

