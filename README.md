# Employee-Tracker

## Description

A command line mysql database application for tracking employees, department and roles. It helps developers often tasked with creating interfaces that make it easy for non-developers to view and interact with information stored in databases or content managment systems.

The solution of this application is designed using node.js, inquirer package and mySQL.

## Demo

Link for display : https://drive.google.com/file/d/1QEwalLyVTi78FGoviqjWZAuKTs3f9zZH/view

## User Story

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

## Usage

Use the employeeSchema.sql script to design and create the database.
Use the seeds.sql script to pre populate the db with data to work on.
Install the npm dependencies
Open  terminal and change into the correct path. Run "node index.js" and you will be prompted with options.

## Database


Design the following database schema containing three tables:

![Database Schema](assets/images/schema.png)

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager


  # Features

Alows the user to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department


# Contribution
  Pull requests are always welcome

# Questions
 For any questions on this repo please feel free to raise an issue.    


