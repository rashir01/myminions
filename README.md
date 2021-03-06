# My Minons DB 

## Purpose

This app helps the user manipulate an employee DB by using several JS/Node technologies. Users can connect to the db and update tables based on given prompts. 

The prompts are given using the inquirer tool. The tables are displayed using the console.table method. Mysql2 package is used to handle the DB connection

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
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
```

## DEMOS

The following gifs show an example of the application being used from the command line:

A demo showing intial menu and view action (view all departments, view all roles, view all employees, and exit)

![Initial and View Demo](assets/menu_and_view_demo.gif)

A demo showing add department and add role options

![Add deparment and role](assets/add_dept_and_role_demo.gif)

A demo shwoing add employee and update employee options

![Add and update employee](assets/add_and_modify_emp_demo.gif)

## Getting Started

run npm install to install the app

run npm start to start the app

follow the prompts


## Database Schema Design

the schema contains the following three tables:

* `department`

    * `id`: `INT PRIMARY KEY`

    * `name`: `VARCHAR(30)` to hold department name

* `role`

    * `id`: `INT PRIMARY KEY`

    * `title`: `VARCHAR(30)` to hold role title

    * `salary`: `DECIMAL` to hold role salary

    * `department_id`: `INT` to hold reference to department role belongs to

* `employee`

    * `id`: `INT PRIMARY KEY`

    * `first_name`: `VARCHAR(30)` to hold employee first name

    * `last_name`: `VARCHAR(30)` to hold employee last name

    * `role_id`: `INT` to hold reference to employee role

    * `manager_id`: `INT` to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)


## Questions
[Github rashir01](https://github.com/rashir01)

Email: ray.dev.seng@gmail.com