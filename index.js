const inquirer = require ('inquirer');

const QUESTIONS = [
  {
    type: 'input', 
    message: 'option 1',
    name: 'employee name'
  }, 
  {
    type: 'input', 
    message: 'option 2', 
    name: 'emp name 2'
  }
];

function askQuestions() {
  console.log('What would you like to do');
  inquirer
  .prompt(QUESTIONS)
  .then((response) => {
    console.log(response);
  });
}

askQuestions();