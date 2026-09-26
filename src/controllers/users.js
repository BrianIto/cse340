import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { authenticateUser, createUser, getAllUsers } from "../models/users.js";

const registrationValidation = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ max: 100 })
		.withMessage("Name cannot exceed 100 characters"),
	body("email")
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Please provide a valid email address"),
	body("password")
		.isLength({ min: 7, max: 128 })
		.withMessage("Password must be between 7 and 128 characters"),
];

const loginValidation = [
	body("email").trim().normalizeEmail().isEmail().withMessage("Please provide a valid email address"),
	body("password").notEmpty().withMessage("Password is required"),
];

const showUserRegistrationForm = (req, res) => {
	res.render("register", { title: "Register" });
};

const processUserRegistrationForm = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach((error) => req.flash("error", error.msg));
		return res.redirect("/register");
	}

	const { name, email, password } = req.body;
	try {
		const passwordHash = await bcrypt.hash(password, 10);
		await createUser(name, email, passwordHash);
		req.flash("success", "Registration successful! Please log in.");
		res.redirect("/login");
	} catch (error) {
		console.error("Error registering user:", error);
		req.flash(
			"error",
			error.code === "23505"
				? "An account with that email already exists."
				: "An error occurred during registration. Please try again.",
		);
		res.redirect("/register");
	}
};

const showLoginForm = (req, res) => {
	res.render("login", { title: "Login" });
};

const processLoginForm = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.array().forEach((error) => req.flash("error", error.msg));
		return res.redirect("/login");
	}

	try {
		const user = await authenticateUser(req.body.email, req.body.password);
		if (!user) {
			req.flash("error", "Invalid email or password.");
			return res.redirect("/login");
		}

		req.session.user = user;
		req.flash("success", "Login successful!");
		if (process.env.NODE_ENV === "development") {
			console.log("User logged in:", user);
		}
		res.redirect("/dashboard");
	} catch (error) {
		console.error("Error during login:", error);
		req.flash("error", "An error occurred during login. Please try again.");
		res.redirect("/login");
	}
};

const processLogout = (req, res) => {
	delete req.session.user;
	req.flash("success", "Logout successful!");
	res.redirect("/login");
};

const requireLogin = (req, res, next) => {
	if (!req.session?.user) {
		req.flash("error", "You must be logged in to access that page.");
		return res.redirect("/login");
	}
	next();
};

/**
 * Returns middleware that allows access only to users with the given role.
 *
 * @param {string} role The role required to access the route.
 * @param {string} unauthorizedRedirect Where to send an authenticated user without the role.
 * @returns {import("express").RequestHandler} Role-checking middleware.
 */
const requireRole = (role, unauthorizedRedirect = "/") => (req, res, next) => {
	if (!req.session?.user) {
		req.flash("error", "You must be logged in to access this page.");
		return res.redirect("/login");
	}

	if (req.session.user.role_name !== role) {
		req.flash("error", "You do not have permission to access this page.");
		return res.redirect(unauthorizedRedirect);
	}

	next();
};

const showDashboard = (req, res) => {
	const { name, email } = req.session.user;
	res.render("dashboard", { title: "Dashboard", name, email });
};

const showUsersPage = async (req, res, next) => {
	try {
		const users = await getAllUsers();
		res.render("users", { title: "Registered Users", users });
	} catch (error) {
		next(error);
	}
};

export {
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
};
