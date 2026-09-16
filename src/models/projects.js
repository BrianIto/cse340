import db from "./db.js";

const getAllProjects = async () => {
	const query = `
	SELECT 
	service_project.project_id, 
	service_project.organization_id, 
	service_project.title, 
	service_project.location, 
	service_project.date,
	organization.name AS organization_name
	FROM public.service_project
	JOIN public.organization ON service_project.organization_id = organization.organization_id;

    `;

	const result = await db.query(query);

	return result.rows;
};

/**
 * Get a list of upcoming service projects, limited by the specified number of projects.
 * @param {number} number_of_projects - The maximum number of upcoming projects to retrieve.
 * @returns {Promise<Array>} A promise that resolves to an array of upcoming service projects.
 */
const getUpcomingProjects = async (number_of_projects) => {
	const query = `
	SELECT 
	service_project.project_id, 
	service_project.organization_id, 
	service_project.title, 
	service_project.location, 
	service_project.description,
	service_project.date,
	organization.name AS organization_name
	FROM public.service_project
	JOIN public.organization ON service_project.organization_id = organization.organization_id
	ORDER BY service_project.date ASC
	LIMIT ${number_of_projects};
	`;
	const result = await db.query(query);
	return result.rows;
};

/***
 * Get the details of a specific service project by its ID.
 * @param {number} project_id - The ID of the service project to retrieve.
 * @returns {Promise<Object>} A promise that resolves to an object containing the service project details.
 */
const getProjectDetails = async (project_id) => {
	const query = `
	SELECT 
	service_project.project_id, 
	service_project.organization_id, 
	service_project.title, 
	service_project.location, 
	service_project.description,
	service_project.date,
	organization.name AS organization_name
	FROM public.service_project
	JOIN public.organization ON service_project.organization_id = organization.organization_id
	WHERE service_project.project_id = ${project_id};
	`;
	const result = await db.query(query);
	return result.rows[0];
};

export { getAllProjects, getProjectDetails, getUpcomingProjects };
