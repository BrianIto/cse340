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
	addProjectVolunteer,
	processEditProjectForm,
	processNewProjectForm,
	projectValidation,
	removeProjectVolunteer,
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
import {
	loginValidation,
	processLoginForm,
	processLogout,
	processUserRegistrationForm,
	registrationValidation,
	requireLogin,
	requireRole,
	showDashboard,
	showLoginForm,
	showUserRegistrationForm,
	showUsersPage,
} from "./controllers/users.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/register", showUserRegistrationForm);
router.post("/register", registrationValidation, processUserRegistrationForm);
router.get("/login", showLoginForm);
router.post("/login", loginValidation, processLoginForm);
router.get("/logout", processLogout);
router.get("/dashboard", requireLogin, showDashboard);
router.get("/users", requireRole("admin", "/dashboard"), showUsersPage);
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.post("/project/:id/volunteer", requireLogin, addProjectVolunteer);
router.post("/project/:id/remove-volunteer", requireLogin, removeProjectVolunteer);
router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);
router.post(
	"/edit-project/:id",
	requireRole("admin"),
	projectValidation,
	processEditProjectForm,
);
router.get("/new-project", requireRole("admin"), showNewProjectForm);
router.post(
	"/new-project",
	requireRole("admin"),
	projectValidation,
	processNewProjectForm,
);
router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetail);
router.get("/new-category", requireRole("admin"), showNewCategoryForm);
router.post(
	"/new-category",
	requireRole("admin"),
	categoryValidation,
	processNewCategoryForm,
);
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);
router.post(
	"/edit-category/:id",
	requireRole("admin"),
	categoryValidation,
	processEditCategoryForm,
);
router.get(
	"/assign-categories/:projectId",
	requireRole("admin"),
	showAssignCategoriesForm,
);
router.post(
	"/assign-categories/:projectId",
	requireRole("admin"),
	processAssignCategoriesForm,
);
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);
router.post(
	"/edit-organization/:id",
	requireRole("admin"),
	organizationValidation,
	processEditOrganizationForm,
);
router.get(
	"/edit-organization/:id",
	requireRole("admin"),
	showEditOrganizationForm,
);

// error-handling routes
router.get("/test-error", testErrorPage);
// Handle user registration form submission
router.post(
	"/new-organization",
	requireRole("admin"),
	newOrganizationValidation,
	processNewOrganizationForm,
);

export default router;
