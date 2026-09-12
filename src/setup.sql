-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
	organization_id INTEGER,
	description TEXT NOT NULL,
	location TEXT,
	date TIMESTAMP,
	FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

SELECT * FROM organization;

SELECT * FROM service_project;


INSERT INTO service_project (
    title,
    organization_id,
    description,
    location,
    date
) VALUES
-- BrightFuture Builders (organization_id = 1)
(
    'Community Center Renovation',
    1,
    'Renovate a local community center to provide a safer and more welcoming space for neighborhood activities.',
    'Downtown Community Center',
    '2026-09-20 08:00:00'
),
(
    'Neighborhood Playground Build',
    1,
    'Build a new playground with safe and sustainable materials for children in the local community.',
    'Riverside Park',
    '2026-10-03 07:30:00'
),
(
    'Affordable Home Repair Day',
    1,
    'Assist low-income families with essential home repairs, painting, and accessibility improvements.',
    'Westside Neighborhood',
    '2026-10-17 08:00:00'
),
(
    'School Roof Restoration',
    1,
    'Repair and restore the roof of a local public school to improve safety and prevent water damage.',
    'Lincoln Elementary School',
    '2026-11-07 07:00:00'
),
(
    'Community Ramp Installation',
    1,
    'Install accessibility ramps for community buildings to improve access for people with disabilities.',
    'Northside Community District',
    '2026-11-21 08:30:00'
),

-- GreenHarvest Growers (organization_id = 2)
(
    'Community Garden Planting',
    2,
    'Prepare garden beds and plant seasonal vegetables for a neighborhood community garden.',
    'Greenwood Community Garden',
    '2026-09-26 07:00:00'
),
(
    'Urban Farming Workshop',
    2,
    'Teach residents the basics of urban farming, composting, and sustainable food production.',
    'GreenHarvest Learning Center',
    '2026-10-10 09:00:00'
),
(
    'School Vegetable Garden',
    2,
    'Create a vegetable garden where students can learn about agriculture, nutrition, and sustainability.',
    'Jefferson Middle School',
    '2026-10-24 08:00:00'
),
(
    'Community Composting Day',
    2,
    'Build composting stations and educate residents about reducing household organic waste.',
    'Oakwood Neighborhood',
    '2026-11-14 08:30:00'
),
(
    'Winter Harvest Preparation',
    2,
    'Prepare community gardens for the winter growing season and distribute harvested produce.',
    'Eastside Urban Farm',
    '2026-12-05 07:30:00'
),

-- UnityServe Volunteers (organization_id = 3)
(
    'Food Bank Support Day',
    3,
    'Help organize, package, and distribute food donations to families in need.',
    'Central City Food Bank',
    '2026-09-19 09:00:00'
),
(
    'Park Cleanup Initiative',
    3,
    'Clean public spaces, collect litter, and help maintain walking trails throughout the park.',
    'Liberty Park',
    '2026-10-04 08:00:00'
),
(
    'Senior Community Assistance',
    3,
    'Support elderly residents with household tasks, grocery organization, and community activities.',
    'Sunrise Senior Center',
    '2026-10-18 10:00:00'
),
(
    'Charity Donation Sorting',
    3,
    'Sort clothing, household goods, and other donated items before distribution to local families.',
    'UnityServe Distribution Center',
    '2026-11-08 09:00:00'
),
(
    'Holiday Community Drive',
    3,
    'Collect and organize food, toys, and essential supplies for families during the holiday season.',
    'UnityServe Community Hall',
    '2026-12-12 08:00:00'
);

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE category_project (
	category_id INTEGER,
	project_id INTEGER,
	PRIMARY KEY (category_id, project_id),
	FOREIGN KEY (category_id) REFERENCES category(category_id),
	FOREIGN KEY (project_id) REFERENCES service_project(project_id)
);

INSERT INTO category (name) VALUES 
	('Construction & Infrastructure'), 
	('Environment & Susteinability'), 
	('Community Support & Outreach');

INSERT INTO category_project (project_id, category_id) VALUES
-- Construction & Infrastructure
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),

-- Environment & Sustainability
(2, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(12, 2),

-- Community Support & Outreach
(1, 3),
(3, 3),
(5, 3),
(6, 3),
(7, 3),
(8, 3),
(11, 3),
(12, 3),
(13, 3),
(14, 3),
(15, 3);

