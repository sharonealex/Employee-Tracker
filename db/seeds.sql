
insert into department (department_name)
values ('IT');
insert into department (department_name)
values ('Human Resources');
insert into department (department_name)
values ('Business Owners');
insert into department (department_name)
values ('Sales');
insert into department (department_name)
values ('Finance');


insert into employees (first_name, last_name, role_id, manager_id)
values ('Michael', 'Sott', 1, 1);
insert into employees (first_name, last_name, role_id, manager_id)
values ('Jim', 'Halpert', 2, 1);
insert into employees (first_name, last_name, role_id, manager_id)
values ('Dwight', 'Schrute', 2, 1);
insert into employees (first_name, last_name, role_id, manager_id)
values ('Pam', 'Beasley', 4, 1);
insert into employees (first_name, last_name, role_id, manager_id)
values ('Kevin', 'Malone', 3, 1);
insert into employees (first_name, last_name, role_id, manager_id)
values ('Toby', 'Flannagan', 5, 2);
insert into employees (first_name, last_name, role_id, manager_id)
values ('Robert', 'California', 6, 2);

insert into roles (title, salary, department_id)
values ('General Manager', 120000, 3);
insert into roles (title, salary, department_id)
values ('Salesman', 80000, 4);
insert into roles (title, salary, department_id)
values ('Accountant', 90000, 5);
insert into roles (title, salary, department_id)
values ('SysAdmin', 70000, 1);
insert into roles (title, salary, department_id)
values ('HR Talent', 55000, 2);
insert into roles (title, salary, department_id)
values ('Partner', 250000, 3);