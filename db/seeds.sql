INSERT INTO department (dept_name)
VALUES ('Back of House'),
('Front of House'),
('Management');

INSERT INTO roles (title, salary, department_id)
VALUES ('Chef', 65000, 1),
('Sous Chef', 60000, 1),
('Cook', 50000, 1),
('Dishwasher',45000, 1),
('Bartender', 50000, 2),
('Server', 50000, 2),
('Host', 35000, 2),
('General Manager', 98000, 3),
('Assistant Manager', 58000, 3),
('Bar Manager', 58000, 3),
('HR Manager', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ryan', 'Arena', 7, 9),
('Sophia', 'Ortiz', 7, 9),
('Amanda', 'Martinez', 7, 9),
('Eliza', 'White', 7, 9),
('Olivia', 'Hobaica', 7, 9),
('Ed', 'Glover', 4, 1),
('Javis', 'Boutwell', 3, 1),
('Brandon', 'Kapu', 3, 1),
('Omari', 'Jenkins', 3, 1),
('Buck', 'Davis', 5, 10),
('Natalie', 'Rapken', 5, 10),
('Cassie', 'Rodgers', 5, 10),
('MIcky', 'Scott', 5, 10),
('Chandler', 'Scott', 5, 10),
('Joshua', 'Ramatowski', 1, 8),
('Marcus', 'Clark', 10, 8),
('Destinie', 'Rodriguez', 9, 8),
('Nathaniel', 'Krueger', 11, NULL),
('AJ', 'Figueroa', 8, NULL),
('Juan', 'Barrera', 6, 9),
('Natalie', 'Knight', 6, 9),
('Marquis', 'Griffin', 6, 9),
('Tyler', 'Rucker', 6, 9),
('Molly', 'Skalski', 6, 9),
('Macki', 'Jordan', 6, 9);

SELECT * FROM employee;
