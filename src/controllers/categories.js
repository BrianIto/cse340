// Import any needed model functions
import { getAllCategories, getCategoryById } from "../models/categories.js";
import { getProjectsFromCategory } from "../models/projects.js";

// Define any controller functions
const showCategoriesPage = async (req, res) => {
	const categories = await getAllCategories();
	const title = "Service Categories";

	res.render("categories", { title, categories });
};

const showCategoryDetail = async (req, res, next) => {
	const categoryId = req.params.id;
	const category = await getCategoryById(categoryId);
	const projects = await getProjectsFromCategory(categoryId);

	if (!category) {
		const error = new Error("Category not found");
		error.status = 404;
		return next(error);
	}
	res.render("category", { title: category.name, category, projects });
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetail };
