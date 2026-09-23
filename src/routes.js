import express from "express";

import { showHomePage } from "./controllers/index.js";
import {
	processNewOrganizationForm,
	showNewOrganizationForm,
	showOrganizationDetailsPage,
	showOrganizationsPage,
} from "./controllers/organizations.js";
import {
	showProjectDetailsPage,
	showProjectsPage,
} from "./controllers/projects.js";
import {
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
router.get("/categories", showCategoriesPage);
router.get("/category/:id", showCategoryDetail);
router.get("/new-organization", showNewOrganizationForm);
// error-handling routes
router.get("/test-error", testErrorPage);
// Handle user registration form submission
router.post("/new-organization", processNewOrganizationForm);

export default router;
