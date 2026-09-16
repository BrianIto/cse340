import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { testConnection } from "./src/models/db.js";
import router from "./src/routes.js";

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Log if dev
app.use((req, _, next) => {
	if (NODE_ENV === "development") console.log(`${req.method} ${req.url}`);
	next();
});

// Add to the locals so EJS templates can pick up this data;
app.use((_, res, next) => {
	res.locals.NODE_ENV = NODE_ENV;
	next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(router);

// Catch-all route for 404 errors
app.use((req, res, next) => {
	const err = new Error("Page Not Found");
	err.status = 404;
	next(err);
});

// Global error handler
app.use((err, req, res, next) => {
	// Log error details for debugging
	console.error("Error occurred:", err.message);
	console.error("Stack trace:", err.stack);

	// Determine status and template
	const status = err.status || 500;
	const template = status === 404 ? "404" : "500";

	// Prepare data for the template
	const context = {
		title: status === 404 ? "Page Not Found" : "Server Error",
		error: err.message,
		stack: err.stack,
	};

	// Render the appropriate error template
	res.status(status).render(`errors/${template}`, context);
});

app.listen(PORT, async () => {
	try {
		await testConnection();
		console.log(`Server is running at http://127.0.0.1:${PORT}`);
		console.log(`Environment: ${NODE_ENV}`);
	} catch (error) {
		console.error("Error connecting to the database:", error);
	}
});
