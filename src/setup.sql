--Organization Table---
--*********************---------
DROP TABLE IF EXISTS organization;
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);
 
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');
 
--projects Table---
--*********************---------
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    eventDate DATE NOT NULL
);
 
INSERT INTO projects
    (organization_id, title, description, location, eventDate)
VALUES
    (1, 'Community Park Renovation', 'Help renovate a local community park by improving pathways, benches, and shared spaces.', 'Central Community Park', '2026-09-12'),
    (1, 'Neighborhood Playground Build', 'Assist with preparing and improving a safe playground area for children and families.', 'Riverside Neighborhood', '2026-09-19'),
    (1, 'Community Center Ramp Repair', 'Support repairs and improvements to a community center.', '3150 South 800 West', '2026-11-26'),
    (1, 'Accessible Walkway Project', 'Help construct and improve accessible walkways around a community facility.', 'Westside Community', '2026-11-07'),
    (1, 'Sustainable Garden Construction', 'Build garden spaces using sustainable materials and community-friendly construction methods.', 'Greenfield Community', '2026-12-10'),
 
    (2, 'Sort Food For Food Bank', 'Pick food from community garden.', 'Happyville Community Garden', '2026-09-19'),
    (2, 'Community Vegetable Harvest', 'Assist volunteers with harvesting and organizing fresh vegetables for the local community.', 'GreenHarvest Farm', '2026-09-20'),
    (2, 'Composting Workshop', 'Help prepare a community workshop focused on composting and sustainable food practices.', 'Eastside Community Center', '2026-09-27'),
    (2, 'School Garden Project', 'Assist students and volunteers with creating and maintaining a school garden.', 'Lincoln Elementary School', '2026-10-04'),
    (2, 'Food Sustainability Fair', 'Support a community event promoting sustainable food production and healthy gardening practices.', 'City Community Hall', '2026-10-11'),
 
    (3, 'Food Donation Drive', 'Help collect, organize, and distribute donated food to the foodbank.', 'UnityServe Community Center', '2026-09-14'),
    (3, 'Senior Center Volunteer Day', 'Assist with community activities and facility support at a local senior center.', 'Lakeside Senior Center', '2026-09-21'),
    (3, 'Community Cleanup Day', 'Join volunteers in cleaning and improving shared public spaces in the community.', 'Southside Neighborhood', '2026-09-28'),
    (3, 'School Supply Drive', 'Help collect and organize school supplies for students and families who need support.', 'UnityServe Volunteer Center', '2026-10-05'),
    (3, 'Charity Outreach Event', 'Support volunteers coordinating an outreach event for local community organizations.', 'Central Civic Hall', '2026-10-12');
 
--category Table---
--*********************---------
DROP TABLE IF EXISTS category;
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description  TEXT NOT NULL
);
 
INSERT INTO category (name, description)
VALUES
 ('Environmental',                                                    -- category_id 1
 'Cleanups, conservation, and sustainability projects.'),
('Educational',                                                       -- category_id 2
 'Tutoring, literacy programs, and school support.'),
('Community Service',                                                 -- category_id 3
 'Neighborhood improvement and local outreach.'),
('Health and Wellness',                                               -- category_id 4
 'Health fairs, food drives, and wellness education.'),
('Food Security',                                                     -- category_id 5
 'Helping with food banks and Growing and distributing food to households that need it. '),
('Housing and Infrastructure',                                        -- category_id 6
 'Building, repairing, and improving the accessibility of shared spaces and homes.'),
('Senior Support',                                                    -- category_id 7
 'Services, companionship, and practical help for older adults.');
 
--project_category Table---
--*********************---------
DROP TABLE IF EXISTS project_category;
CREATE TABLE project_category (
    project_id INTEGER NOT NULL REFERENCES projects(project_id),
    category_id INTEGER NOT NULL REFERENCES category(category_id),
    PRIMARY KEY (project_id, category_id)
);
 
INSERT INTO project_category (project_id, category_id)
VALUES
    (1, 4),
    (2, 3),
    (3, 3),
    (4, 4),
    (5, 1),
    (6, 1),
    (7, 1),
    (8, 1),
    (9, 2),
    (10, 1),
    (11, 2),
    (12, 3),
    (13, 1),
    (14, 1),
    (15, 3);
