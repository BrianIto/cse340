import db from "./db.js";

const addVolunteerToProject = async (userId, projectId) => {
	const result = await db.query(
		`INSERT INTO public.project_volunteer (user_id, project_id)
		 VALUES ($1, $2)
		 ON CONFLICT (user_id, project_id) DO NOTHING
		 RETURNING user_id, project_id;`,
		[userId, projectId],
	);
	return result.rows[0] ?? null;
};

const removeVolunteerFromProject = async (userId, projectId) => {
	const result = await db.query(
		`DELETE FROM public.project_volunteer
		 WHERE user_id = $1 AND project_id = $2
		 RETURNING user_id, project_id;`,
		[userId, projectId],
	);
	return result.rows[0] ?? null;
};

const isVolunteerForProject = async (userId, projectId) => {
	const result = await db.query(
		`SELECT 1
		 FROM public.project_volunteer
		 WHERE user_id = $1 AND project_id = $2;`,
		[userId, projectId],
	);
	return result.rows.length > 0;
};

const getProjectsForVolunteer = async (userId) => {
	const result = await db.query(
		`SELECT service_project.project_id,
				service_project.title,
				service_project.location,
				service_project.date,
				organization.name AS organization_name
		 FROM public.project_volunteer
		 JOIN public.service_project
			ON project_volunteer.project_id = service_project.project_id
		 JOIN public.organization
			ON service_project.organization_id = organization.organization_id
		 WHERE project_volunteer.user_id = $1
		 ORDER BY service_project.date ASC, service_project.title ASC;`,
		[userId],
	);
	return result.rows;
};

export {
	addVolunteerToProject,
	getProjectsForVolunteer,
	isVolunteerForProject,
	removeVolunteerFromProject,
};
