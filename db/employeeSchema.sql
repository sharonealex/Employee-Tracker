drop database if exists employees_db;

create database employees_db;

use employees_db;

create table departments (
    id int auto_increment not null,
    department_name varchar(30) not null,
    primary key (id)
);

create table roles (
    id int auto_increment not null,
    title varchar(30) not null,
    salary decimal(10,0) not null,
    department_id int,
    primary key (id),
    foreign key (department_id) references departments(id),
);

create table employees (
    id int  auto_increment not null,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int not null,
    primary key (id),
    foreign key (role_id) references roles(id),
    fk_employee foreign key (id) references employees(id)
)

ALTER TABLE employees ADD CONSTRAINT fk_employee 
    FOREIGN KEY (manager_id) REFERENCES employees(id);



