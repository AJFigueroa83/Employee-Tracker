INSERT INTO department (dept_name)
VALUES ('Back of House'),
('Front of House'),
('Management');

INSERT INTO roles (title, salary, department_id)
VALUES ('Chef', 65000, 1),
('Assistant Manager', 58000, 3),
('Bar Manager', 58000, 3),
('HR Manager', 60000, 3),
('General Manager', 98000, 3),
('Cook', 50000, 1),
('Dishwasher',45000, 1),
('Bartender', 50000, 2),
('Server', 50000, 2),
('Host', 35000, 2);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('AJ', 'Figueroa', 5, NULL),
('Javis', 'Boutwell', 6, 1),
('Brandon', 'Kapu', 6, 1),
('Omari', 'Jenkins', 6, 1),
('Ed', 'Glover', 7, 1),
('Ryan', 'Arena', 10, 2),
('Sophia', 'Ortiz', 10, 2),
('Amanda', 'Martinez', 10, 2),
('Eliza', 'White', 10, 2),
('Olivia', 'Hobaica', 10, 2),
('Juan', 'Barrera', 9, 2),
('Natalie', 'Knight', 9, 2),
('Marquis', 'Griffin', 9, 2),
('Tyler', 'Rucker', 9, 2),
('Molly', 'Skalski', 9, 2),
('Macki', 'Jordan', 9, 2),
('Buck', 'Davis', 8, 3),
('Natalie', 'Rapken', 8, 3),
('Cassie', 'Rodgers', 8, 3),
('MIcky', 'Scott', 8, 3),
('Chandler', 'Scott', 8, 3),
('Joshua', 'Ramatowski', 1, 5),
('Marcus', 'Clark', 3, 5),
('Destinie', 'Rodriguez', 2, 5),
('Nathaniel', 'Krueger', 4, 5);
