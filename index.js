const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const optionsArray = ['View all departments', 'View all Roles', 'View all employees', 'Add a department', 'Add a role', 'Add an Employee', 'Update and Employee Role', 'Exit'];

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

async function getManagerID(fullName) {
  let firstName = fullName.split(" ")[0] || "";
  let lastName = fullName.split(" ")[1] || "";
  let managerID = await queryDB(`SELECT id FROM employee WHERE first_name = "${firstName}" AND last_name = "${lastName}"`);
  return managerID[0].id;
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
      console.log(JSON.stringify(employeeResponses));
      //get manager id
      let managerID = "NULL";
      if (employeeResponses.manager != "None") {
        managerID = await getManagerID(employeeResponses.manager);
      } 
      console.log(managerID);
      //get role id
      let roleID = await queryDB(`SELECT id FROM roles WHERE title = "${employeeResponses.employeeRole}"`);
      roleID = roleID[0].id;
      console.log("role id " + roleID);
      //insert to db
      await queryDB(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES ("${employeeResponses.firstName}" , "${employeeResponses.lastName}", ${roleID}, ${managerID})`)
      console.log(`${employeeResponses.firstName} ${employeeResponses.lastName} to the DB`);
      //insert into db
    break;
  }
  init();
}

async function init() {
  console.log('What would you like to do');
  const selection = await inquirer.prompt(MENU_QUESTION);
  await processPrompt(selection);
}

init();

/*



    
   
      

          inquirer
          .prompt(EMPLOYEE_QUESTION)
          .then((response) => {
            console.log(response.firstName + " " + response.lastName + " " + response.role + " " + response.manager);
            //find manager id or null
            //find role id or null
            queryDB(`SELECT id FROM roles where title = "${response.role}"`)
            .then((roleID) => {
              let role_id = roleID[0].id;
              let firstName =  response.manager.split(" ")[0] || "";
              let lastName = response.manager.split(" ")[1] || "";
              console.log(`first name ${firstName}, lastName ${lastName}`)
              queryDB(`SELECT id FROM employee WHERE first_name = "${firstName}" AND last_name = "${lastName}"`)
              .then((manager) => {
                console.log("hello manager " + manager[0].id);
                managerID = manager[0].id
                //if (managerID) {
                  queryDB(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES ("${response.firstName}" , "${response.lastName}", ${role_id}, ${managerID})`)
                  //var sql = "INSERT INTO employees (id, name, age, city) VALUES ('1', 'Ajeet Kumar', '27', 'Allahabad')";  
                  .then((resp) => {
                    console.log("Employee added. ")
                    console.log(resp)
                    askQuestions();
                  })
                //todo select users from the db then display to select the manager!
                }).catch((err) => {
                  queryDB(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES ("${firstName}" , "${lastName}", ${role_id}, NULL ) `)
                  .then(() => {
                    console.log("Could not find manager ID. Added with null for manager id");
                    askQuestions();
                  })
                }).finally(() => {
                  
                })
                  
                //}
                
                  
                            
            }).catch((err) => {
              console.log("ERROR: invalid role");
              askQuestions();
            })
            
              
        
        
        
        
      });
      
      // queryDB('SELECT role_name FROM roles')
      // .then((rows) => {
      //   rows.forEach(row => {
      //     //console.log(row.name)
      //     roleArray.push(row);
      //   });
      //   console.log(roleArray);
      //   // inquirer
      //   // .prompt(EMPLOYEE_QUESTION)
      //   // .then((response) => {
      //   //   let firstName = response.firstName;
      //   //   let lastName = response.lastName;
      //     //conver the salary to integer
      //     //let role = response.role;
      //     //let manager = response.manager;
      //     //console.log(`${firstName} ${lastName} ${role} ${manager}`)
          
      //     //add employee to table
      //     askQuestions();
      //   //});
      // })
      
      break; 
    case 'Update and Employee Role':
      //show all the employees
      queryDB(`SELECT concat (first_name, ' ', last_name) as Employee FROM employee`)
      .then((rows) => {
        let employees = [];
        rows.forEach(row => {
          employees.push(row.Employee);
        });
        console.log(employees);
        queryDB('select title from roles')
        .then((rows) => {
          let roles = [];

          rows.forEach(row => {
            roles.push(row.title);
          })
          console.log(roles);

          let dept_question = [ 
            {
              type: 'list', 
              message: 'which employee?',
              name: 'employee', 
              choices: employees
            }, 
            {
              type: 'list', 
              message: 'new role', 
              name: 'role',
              choices: roles
            }
          ];
          inquirer
          .prompt(dept_question)
          .then((response) => {
            console.log(response);

            askQuestions();
          })
        })
        //askQuestions();
      })
      .catch((err) => {
        console.log(err);
      })
      //once the user selects an employee, show all the roles

      //once the user selects a role, submit that to the db

      break;

    default: 
      console.log("invalid option!!");
      process.exit();
  }
}

 WIP
 WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

DONE
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

 WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

  WHEN I choose to add a department
  THEN I am prompted to enter the name of the department and that department is added to the database

WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids

GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
*/

