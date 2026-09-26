// Import any needed model functions
import {
	createCategory,
	getAllCategories,
	getCategoriesByServiceProjectId,
	getCategoryById,
	updateCategory,
	updateCategoryAssignments,
} from "../models/categories.js";
import {
	getProjectDetails,
	getProjectsFromCategory,
} from "../models/projects.js";
import { body, validationResult } from "express-validator";

const categoryValidation = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Category name is required")
		.isLength({ min: 3, max: 100 })
		.withMessage(
			"Category name must be between 3 and 100 characters",
		),
];

const showCategoriesPage = async (req, res) => {
	const categories = await getAllCategories();
	res.render("categories", { title: "Service Categories", categories });
};

const showCategoryDetail = async (req, res, next) => {
	const category = await getCategoryById(req.params.id);
	if (!category) {
		const error = new Error("Category not found");
		error.status = 404;
		return next(error);
	}
	const projects = await getProjectsFromCategory(req.params.id);
	res.render("category", { title: category.name, category, projects });
};

const showNewCategoryForm = (req, res) => {
	res.render("new-category", { title: "Add New Category" });
};

const processNewCategoryForm = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach((error) =>
			req.flash("error", error.msg),
		);
		return res.redirect("/new-category");
	}

	try {
		const categoryId = await createCategory(req.body.name);
		req.flash("success", "Category created successfully!");
		res.redirect(`/category/${categoryId}`);
	} catch (error) {
		console.error("Error creating category:", error);
		req.flash("error", "There was an error creating the category.");
		res.redirect("/new-category");
	}
};

const showEditCategoryForm = async (req, res, next) => {
	const category = await getCategoryById(req.params.id);
	if (!category) {
		const error = new Error("Category not found");
		error.status = 404;
		return next(error);
	}
	res.render("edit-category", { title: "Edit Category", category });
};

const processEditCategoryForm = async (req, res) => {
	const categoryId = req.params.id;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach((error) =>
			req.flash("error", error.msg),
		);
		return res.redirect(`/edit-category/${categoryId}`);
	}

	try {
		await updateCategory(categoryId, req.body.name);
		req.flash("success", "Category updated successfully!");
		res.redirect(`/category/${categoryId}`);
	} catch (error) {
		console.error("Error updating category:", error);
		req.flash("error", "There was an error updating the category.");
		res.redirect(`/edit-category/${categoryId}`);
	}
};

const showAssignCategoriesForm = async (req, res) => {
	const projectId = req.params.projectId;
	const [projectDetails, categories, assignedCategories] =
		await Promise.all([
			getProjectDetails(projectId),
			getAllCategories(),
			getCategoriesByServiceProjectId(projectId),
		]);
	res.render("assign-categories", {
		title: "Assign Categories to Project",
		projectId,
		projectDetails,
		categories,
		assignedCategories,
	});
};

const processAssignCategoriesForm = async (req, res) => {
	const projectId = req.params.projectId;
	const selectedCategoryIds = req.body.categoryIds || [];
	const categoryIds = Array.isArray(selectedCategoryIds)
		? selectedCategoryIds
		: [selectedCategoryIds];
	try {
		await updateCategoryAssignments(projectId, categoryIds);
	} catch (e) {
		console.error("Error updating category assignments:", e);
		req.flash(
			"error",
			"There was an error updating category assignments.",
		);
		return res.redirect(`/project/${projectId}`);
	}
	req.flash("success", "Categories updated successfully.");
	res.redirect(`/project/${projectId}`);
};

export {
	categoryValidation,
	showCategoriesPage,
	showCategoryDetail,
	showNewCategoryForm,
	processNewCategoryForm,
	showEditCategoryForm,
	processEditCategoryForm,
	showAssignCategoriesForm,
	processAssignCategoriesForm,
};
