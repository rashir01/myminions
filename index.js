const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const MENU_QUESTION = [ 
  {
    type: 'list', 
    message: 'What would you like to do?',
    name: 'userSelection', 
    choices: ['View all departments', 'View all Roles', 'View all employees', 'Add a department', 'Add a role', 'Add an Employee', 'Update and Employee Role', 'Exit']
  }
];

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the classlist_db database.`)
);

let p = new Promise((resolve, reject) => {
  
  db.query('SELECT * FROM department', function (err, results) {
    resolve(results);
    reject(err);
  });
})



function determineNextAction(option) {
  switch(option.userSelection) {
    case 'View all departments': 
      console.log(`validOption ${option.userSelection}`);
      p.then((message) => {
        console.table(message);
        askQuestions();
      })
      break;
    

    default: 
      askQuestions();
  }
}

function askQuestions() {
  console.log('What would you like to do');
  inquirer
  .prompt(MENU_QUESTION)
  .then((response) => {
    //console.log(response);
    determineNextAction(response);
  })
}

askQuestions();


/* WIP
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
*/

/*DONE
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
*/

/*NOT YET STARTED

WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
*/