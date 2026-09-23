import db from "./db.js";

const getAllCategories = async () => {
	const query = `
	SELECT 
	category.name, category.category_id
	FROM public.category;
    `;

	const result = await db.query(query);

	return result.rows;
};

const createCategory = async (name) => {
	const result = await db.query(
		`INSERT INTO public.category (name) VALUES ($1) RETURNING category_id;`,
		[name],
	);
	return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
	const result = await db.query(
		`UPDATE public.category SET name = $1 WHERE category_id = $2 RETURNING category_id;`,
		[name, categoryId],
	);
	if (result.rows.length === 0) {
		throw new Error("Category not found");
	}
	return result.rows[0].category_id;
};

const getCategoriesByServiceProjectId = async (projectId) => {
	const query = `
		SELECT category_id
		FROM public.category_project
		WHERE project_id = $1;
	`;
	const result = await db.query(query, [projectId]);
	return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
	const query = `
		INSERT INTO public.category_project (project_id, category_id)
		VALUES ($1, $2);
	`;
	await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
	await db.query(
		`DELETE FROM public.category_project WHERE project_id = $1;`,
		[projectId],
	);

	for (const categoryId of categoryIds) {
		await assignCategoryToProject(projectId, categoryId);
	}
};

const getCategoryById = async (id) => {
	const query = `
	SELECT category_id, name FROM public.category
	WHERE category.category_id = $1;
	`;

	const result = await db.query(query, [id]);
	return result.rows[0];
};

export {
	createCategory,
	getAllCategories,
	getCategoriesByServiceProjectId,
	getCategoryById,
	updateCategory,
	updateCategoryAssignments,
};
