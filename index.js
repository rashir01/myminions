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

async function processPrompt(prompt) {
  switch(prompt.userSelection) {
    case 'View all departments': 
      const departmentResults = await queryDB('SELECT * FROM department');
      console.table(departmentResults);
      break;
    case 'View all Roles':
      const roleResults = await queryDB(
        `SELECT roles.id, title, salary, department.name AS department 
        FROM roles 
        JOIN department ON roles.department_id = department.id`)
      console.table(roleResults);
    break;
    case 'View all employees': 
      const employeeResults = await viewAllEmployees();
      console.table(employeeResults);
        
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
const posts = [
  { title: "post one", body: "this is post one"},
  { title: "post two", body: "this is post two"}
]

function getPosts() {
  setTimeout(() => {
    let output = '';
    posts.forEach((post) => {
      output += `${post.title}\n`
    });
    console.log(output);
  }, 1000);
}

function createPost(post) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      posts.push(post);

      const error = false;

      if(!error) {
        resolve();
      } else {
        reject ('Error: something went wrong');
      }
    },2000)
  }) 
}

function creaatePost2(post) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      posts.push(post);
      const error = false; 
      if (!error) {
        resolve();
      } else {
        reject ('Error: something wrong in createpost2');
      }
    }, 4000)
  })
}

//getPosts();

// createPost({title: 'Post Three', body: "This is post three"})
//   .then(getPosts)
//   .catch(err => console.log(err));

async function init() {
  await creaatePost2({title: 'post four', body: 'this is post four'});
  await createPost({title: 'Post Three', body: "This is post three"});
  getPosts();
}

init();





// const promise1 = new Promise((resolve, reject) => 
//   setTimeout(resolve, 4000, 'promise1'));
// const promise2 = new Promise((resolve, reject) => 
//   setTimeout(resolve, 1, 'promise2'));
// const promise3 = new Promise((resolve, reject) => 
//   setTimeout(resolve, 1, 'promise3'));

// Promise.all([promise1, promise2, promise3]).
// then((values)=> {console.log(values)});




const EMPLOYEE_QUESTION = [
  {
    type: 'input', 
    message: 'First Name', 
    name: 'firstName',
  },
  {
    type: 'input',
    message: 'Last Name', 
    name: 'lastName' 
  },
  {
    type: 'input', 
    message: 'Select role', 
    name: 'role',
  }, 
  {
    type: 'input', 
    message: 'Manager', 
    name: 'manager'
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


let queryDB = (queryString) => {
  return new Promise ((resolve, reject) => {
    db.query(queryString, function (err, results) {
      resolve(results);
      reject(err);
    })
  })
}

async function init() {
  
}





function determineNextAction(option) {
  switch(option.userSelection) {

    
    
    case 'Add a department':
      inquirer.prompt([
        {
          type: 'input',
          message: "Enter department name",
          name: "deptName",
        }]
      ).then((response) => {
        let dbString = `INSERT INTO department (name) VALUES ("${response.deptName}")`;
        queryDB(dbString)
        .then((message) => {
          console.table(message);
          askQuestions();
        });
      });
      break;
    case 'Add a role': 
      queryDB("SELECT name FROM department")
      .then((rows) => {
        let departments = [];
        rows.forEach(row => {
          //console.log(row.name)
          departments.push(row.name);
        });
        let dept_question = [ 
          {
            type: 'input', 
            message: 'what is the name of the role', 
            name: 'roleName'
          },
          {
            type: 'input', 
            message: 'what ist he salary', 
            name: 'roleSalary'
          },
          {
            type: 'list', 
            message: 'which department?',
            name: 'deptSelection', 
            choices: departments
          }
        ];

        inquirer
        .prompt(dept_question)
        .then((response) => {
          let deptName = response.deptSelection;
          let roleName = response.roleName;
          //conver the salary to integer
          let salary = response.roleSalary;
          
          //get the department id given the name
          queryDB(`SELECT id FROM department where name = "${deptName}"`)
          .then((response) => {
            let deptID = parseInt(response[0].id);
            queryDB(`INSERT INTO roles (title, salary, department_id) 
            VALUES ("${roleName}", "${salary}", ${deptID} )`)
            .then((response) => {
              console.log(response);
              askQuestions();
            })           
          })
        })
      });
      break;
    case 'Add an Employee':
      console.log("add employee");
      //ask for the employee data
      

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

function askQuestions() {
  console.log('What would you like to do');
  inquirer
  .prompt(MENU_QUESTION)
  .then((response) => {
    //console.log(response);
    //console.log(response);

    determineNextAction(response);
  })
}

askQuestions();

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

