USE employee_db

 select * from employee;
-- select * from department;
-- select title from roles;

-- SELECT roles.id, title, salary, department.name 
-- FROM roles
-- JOIN department ON roles.department_id = department.id;

-- SELECT id FROM department where name = 'Human Resources'

-- SELECT employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name",
--   roles.title AS "Job Title", department.name, 
--   concat(e2.first_name, ' ', e2.last_name) AS Manager
-- FROM employee
-- JOIN roles ON employee.role_id = roles.id
-- JOIN department ON roles.department_id = department.id
-- LEFT JOIN employee as e2 on employee.id = e2.manager_id ;

-- select employee.first_name as Employee, concat(e2.first_name,' ' ,e2.last_name) as manager
-- From employee
-- Join employee as e2 on employee.id = e2.manager_id;


-- WHEN I choose to view all employees
-- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to


-- SELECT book_name, book_prices.price
-- FROM favorite_books
-- JOIN book_prices ON favorite_books.book_price = book_prices.id;