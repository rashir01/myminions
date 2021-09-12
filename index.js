const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

//init choices
const optionsArray = ['View all departments', 'View all Roles', 'View all employees', 'Add a department', 'Add a role', 'Add an Employee', 'Update Employee Role', 'Exit'];

const MENU_QUESTION = [ 
  {
    type: 'list', 
    message: 'What would you like to do?',
    name: 'userSelection', 
    choices: optionsArray
  }
];

let addDepartmentQuestions = [ 
  {
    type: 'input', 
    message: 'what is the name of the role', 
    name: 'roleName'
  },
  {
    type: 'input', 
    message: 'what ist he salary', 
    name: 'roleSalary'
  }
];

let addEmployeeQuestions = [
  {
    type: 'input', 
    message: 'What is the employee first name?',
    name: 'firstName'
  },
  {
    type: 'input', 
    message: 'What is the employee last name', 
    name: 'lastName'
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

async function queryDB (queryString)  {
  return new Promise ((resolve, reject) => {
    db.query(queryString, function (err, results) {
      resolve(results);
      reject(err);
    })
  })
}

//lists all the employees by "first_name last_name"
async function viewAllEmployees() {
  let dbString = `SELECT employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name",
      roles.title AS "Job Title", department.name, 
      concat(e2.first_name, ' ', e2.last_name) AS Manager
      FROM employee
      JOIN roles ON employee.role_id = roles.id
      JOIN department ON roles.department_id = department.id
      LEFT JOIN employee as e2 on e2.id = employee.manager_id ;`   
    let employeeResults = await queryDB(dbString)
    return employeeResults;
}

async function viewDepartments() {
  const departmentResults = await queryDB('SELECT * FROM department');
  console.table(departmentResults);
}

async function getDepartmentNames() {
  const deptNamesDBResult = await queryDB(`SELECT name FROM department`);
  return  deptNamesDBResult.map((a) => {return a.name}); //this removes extra stuff that mysql adds and just returns the names
}

async function getRoleNames() {
  const roleNamesDBResult = await queryDB(`SELECT title FROM roles`);
  return roleNamesDBResult.map((a) => {return a.title});
}

async function getEmployeeNames() {
  const employeeNamesResult = await queryDB(`SELECT concat (first_name, ' ', last_name) AS manager FROM employee`);
  return employeeNamesResult.map((a) => {return a.manager});
}

async function getEmployeeIdFromFullName(fullName) {
  let firstName = fullName.split(" ")[0] || "";
  let lastName = fullName.split(" ")[1] || "";
  let employeeID = await queryDB(`SELECT id FROM employee WHERE first_name = "${firstName}" AND last_name = "${lastName}"`);
  return employeeID[0].id;
}

async function getRoleIdFromRoleName(roleName) {
  let roleID = await queryDB(`SELECT id FROM roles WHERE title = "${roleName}"`);
  return roleID[0].id;
}

async function processPrompt(prompt) {
  switch(prompt.userSelection) {
    case 'View all departments': 
      await viewDepartments();  
    break;
    case 'View all Roles':
      const roleResults = await queryDB(
        `SELECT roles.id, title, salary, department.name AS department 
        FROM roles 
        JOIN department ON roles.department_id = department.id`);
      console.table(roleResults);
    break;
    case 'View all employees': 
      const employeeResults = await viewAllEmployees();
      console.table(employeeResults);
    break;
    case 'Add a department':
      const response = await inquirer.prompt([{ type: 'input', message: "Enter department name", name: "deptName"}]);
      let dbString = `INSERT INTO department (name) VALUES ("${response.deptName}")`;
      await  queryDB(dbString);
      await viewDepartments();
    break;
    case 'Add a role':
      //get department names to prompt the user to choose the dept associated with the rol
      let departmentNames = await getDepartmentNames();
      const whichDepartment = [{
        type: 'list', 
        message: 'which department?',
        name: "deptName",
        choices: departmentNames
      }]
      //ask the user to enter role name, salary, and which department
      const roleResponses = await inquirer.prompt(addDepartmentQuestions.concat(whichDepartment));
      //get the department id of the chosen department
      let departmentID = await queryDB(`SELECT id FROM department where name = "${roleResponses.deptName}"`);
      departmentID = departmentID[0].id;
      await queryDB(`INSERT INTO roles (title, salary, department_id) 
            VALUES ("${roleResponses.roleName}", "${roleResponses.roleSalary}", ${departmentID} )`);
      console.log(`Added role ${roleResponses.roleName}`);
    break;
    case 'Add an Employee':
      console.log("add employee");
      //get roleNames and employeeNames from DB 
      let roleNames = await getRoleNames();
      let managerName = await getEmployeeNames();
      managerName.push("None"); //allow manager to be none
      const employeeAdditionalQuestions = [
        {
          type: 'list', 
          message: 'What is the employee role?',
          name: 'employeeRole',
          choices: roleNames
        }, 
        {
          type: 'list', 
          message: 'Who is the employees manager?',
          name: "manager",
          choices: managerName
        }
      ]
      //inquire with employee questions, roleNames, and employeeNames
      const employeeResponses = await inquirer.prompt(addEmployeeQuestions.concat(employeeAdditionalQuestions));
      //get manager id
      let managerID = "NULL";
      if (employeeResponses.manager != "None") {
        managerID = await getEmployeeIdFromFullName(employeeResponses.manager);
      } 
      //get role id
      let roleID = await queryDB(`SELECT id FROM roles WHERE title = "${employeeResponses.employeeRole}"`);
      roleID = roleID[0].id;
      //insert to db
      await queryDB(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES ("${employeeResponses.firstName}" , "${employeeResponses.lastName}", ${roleID}, ${managerID})`)
      console.log(`${employeeResponses.firstName} ${employeeResponses.lastName} to the DB`);
      //insert into db
    break;
    case 'Update Employee Role':
      //show all the employees
      let employeeList = await getEmployeeNames();
      let selectedEmployee = await inquirer.prompt([{ type: 'list', message: "which employee do you want to edit", name: "empName", choices: employeeList}]);
      //get selected employee id
      const employeeUpdateId = await getEmployeeIdFromFullName(selectedEmployee.empName);
      //show all the roles
      let rolesList = await getRoleNames();
      let selectedRole = await inquirer.prompt([{ type: 'list', message: "which role do you want to assign", name: "roleName", choices: rolesList}]);
      //get selected role id
      const updateRoleId = await getRoleIdFromRoleName(selectedRole.roleName);
      //set the employee id to the role id
      await queryDB(`UPDATE employee SET role_id = ${updateRoleId} WHERE id = ${employeeUpdateId};`)
      console.log(`Updated employee ${selectedEmployee.empName}`);
    break;
    case 'Exit': 
      console.log('Goodbye');
      process.exit();
  }
  init();
}

async function init() {
  console.log('What would you like to do');
  const selection = await inquirer.prompt(MENU_QUESTION);
  await processPrompt(selection);
}

init();
