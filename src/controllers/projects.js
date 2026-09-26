// Import any needed model functions
import {
	createProject,
	getProjectDetails,
	getUpcomingProjects,
	updateProject,
} from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import {
	addVolunteerToProject,
	isVolunteerForProject,
	removeVolunteerFromProject,
} from "../models/volunteers.js";
import { body, validationResult } from "express-validator";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("Title is required")
		.isLength({ min: 3, max: 200 })
		.withMessage("Title must be between 3 and 200 characters"),
	body("description")
		.trim()
		.notEmpty()
		.withMessage("Description is required")
		.isLength({ max: 1000 })
		.withMessage("Description must be less than 1000 characters"),
	body("location")
		.trim()
		.notEmpty()
		.withMessage("Location is required")
		.isLength({ max: 200 })
		.withMessage("Location must be less than 200 characters"),
	body("date")
		.notEmpty()
		.withMessage("Date is required")
		.isISO8601()
		.withMessage("Date must be a valid date format"),
	body("organizationId")
		.notEmpty()
		.withMessage("Organization is required")
		.isInt()
		.withMessage("Organization must be a valid integer"),
];

const showProjectsPage = async (req, res) => {
	const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
	res.render("projects", { title: "Upcoming Service Projects", projects });
};

const showProjectDetailsPage = async (req, res, next) => {
	const project = await getProjectDetails(req.params.id);
	if (!project) {
		const error = new Error("Project not found");
		error.status = 404;
		return next(error);
	}
	const isVolunteer = req.session.user
		? await isVolunteerForProject(req.session.user.user_id, project.project_id)
		: false;
	res.render("project", { title: project.title, project, isVolunteer });
};

const addProjectVolunteer = async (req, res, next) => {
	try {
		await addVolunteerToProject(req.session.user.user_id, req.params.id);
		req.flash("success", "You are now volunteering for this project.");
		res.redirect(`/project/${req.params.id}`);
	} catch (error) {
		next(error);
	}
};

const removeProjectVolunteer = async (req, res, next) => {
	try {
		await removeVolunteerFromProject(req.session.user.user_id, req.params.id);
		req.flash("success", "You are no longer volunteering for this project.");
		res.redirect(req.body.returnTo === "/dashboard" ? "/dashboard" : `/project/${req.params.id}`);
	} catch (error) {
		next(error);
	}
};

const showNewProjectForm = async (req, res) => {
	const organizations = await getAllOrganizations();
	res.render("new-project", { title: "Add New Service Project", organizations });
};

const processNewProjectForm = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach((error) => req.flash("error", error.msg));
		return res.redirect("/new-project");
	}

	const { title, description, location, date, organizationId } = req.body;
	try {
		const projectId = await createProject(
			title,
			description,
			location,
			date,
			organizationId,
		);
		req.flash("success", "New service project created successfully!");
		res.redirect(`/project/${projectId}`);
	} catch (error) {
		console.error("Error creating new project:", error);
		req.flash("error", "There was an error creating the service project.");
		res.redirect("/new-project");
	}
};

const showEditProjectForm = async (req, res, next) => {
	const [projectDetails, organizations] = await Promise.all([
		getProjectDetails(req.params.id),
		getAllOrganizations(),
	]);
	if (!projectDetails) {
		const error = new Error("Project not found");
		error.status = 404;
		return next(error);
	}
	res.render("edit-project", {
		title: "Edit Service Project",
		projectDetails,
		organizations,
	});
};

const processEditProjectForm = async (req, res) => {
	const projectId = req.params.id;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach((error) => req.flash("error", error.msg));
		return res.redirect(`/edit-project/${projectId}`);
	}

	const { title, description, location, date, organizationId } = req.body;
	await updateProject(
		projectId,
		title,
		description,
		location,
		date,
		organizationId,
	);
	req.flash("success", "Service project updated successfully!");
	res.redirect(`/project/${projectId}`);
};

export {
	projectValidation,
	showProjectsPage,
	showProjectDetailsPage,
	addProjectVolunteer,
	removeProjectVolunteer,
	showNewProjectForm,
	processNewProjectForm,
	showEditProjectForm,
	processEditProjectForm,
};
