import express from "express";

import { showHomePage } from "./controllers/index.js";
import {
	newOrganizationValidation,
	organizationValidation,
	processEditOrganizationForm,
	processNewOrganizationForm,
	showEditOrganizationForm,
	showNewOrganizationForm,
	showOrganizationDetailsPage,
	showOrganizationsPage,
} from "./controllers/organizations.js";
import {
	processEditProjectForm,
	processNewProjectForm,
	projectValidation,
	showEditProjectForm,
	showNewProjectForm,
	showProjectDetailsPage,
	showProjectsPage,
} from "./controllers/projects.js";
import {
	categoryValidation,
	processAssignCategoriesForm,
	processEditCategoryForm,
	processNewCategoryForm,
	showAssignCategoriesForm,
	showEditCategoryForm,
	showNewCategoryForm,
	showCategoriesPage,
	showCategoryDetail,
} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/edit-project/:id", showEditProjectForm);
router.post("/edit-project/:id", projectValidation, processEditProjectForm);
router.get("/new-project", showNewProjectForm);
router.post("/new-project", projectValidation, processNewProjectForm);
router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetail);
router.get("/new-category", showNewCategoryForm);
router.post("/new-category", categoryValidation, processNewCategoryForm);
router.get("/edit-category/:id", showEditCategoryForm);
router.post("/edit-category/:id", categoryValidation, processEditCategoryForm);
router.get("/assign-categories/:projectId", showAssignCategoriesForm);
router.post("/assign-categories/:projectId", processAssignCategoriesForm);
router.get("/new-organization", showNewOrganizationForm);
router.post(
	"/edit-organization/:id",
	organizationValidation,
	processEditOrganizationForm,
);
router.get("/edit-organization/:id", showEditOrganizationForm);

// error-handling routes
router.get("/test-error", testErrorPage);
// Handle user registration form submission
router.post(
	"/new-organization",
	newOrganizationValidation,
	processNewOrganizationForm,
);

export default router;
