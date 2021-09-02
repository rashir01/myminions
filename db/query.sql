USE employee_db

select * from employee;
select * from department;
select * from roles;

SELECT roles.id, title, salary, department.name 
FROM roles
JOIN department ON roles.department_id = department.id;
-- SELECT book_name, book_prices.price
-- FROM favorite_books
-- JOIN book_prices ON favorite_books.book_price = book_prices.id;