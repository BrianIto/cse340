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

const getCategoryById = async (id) => {
	const query = `
	SELECT category.name FROM public.category
	WHERE category.category_id = $1;
	`;

	const result = await db.query(query, [id]);
	return result.rows[0];
};

export { getAllCategories, getCategoryById };
