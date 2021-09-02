USE employee_db;

INSERT INTO department (name)
VALUES ("Human Resources"),
       ("Info Tech"),
       ("Engineering"),
       ("Product Managers"),
       ("Others");

INSERT INTO roles (title, salary, department_id) 
VALUES ("Engineer1", "100000", 3), 
        ("Engineer2", "200000", 3), 
        ("Tech", "60000", 2), 
        ("recruiter", "50000", 1), 
        ("pm", "55000", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Engineer" , "TWO", 2, NULL ), 
        ("Eng", "one", 1, 1),
        ("Tech", "one", 3, null ), 
        ("Recruiter", "one", 4, null), 
        ("PM", "PM", 5, null );


