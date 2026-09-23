// Import any needed model functions
import {
	createOrganization,
	getAllOrganizations,
	getOrganizationDetails,
} from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";

// Define any controller functions
const showOrganizationsPage = async (req, res) => {
	const organizations = await getAllOrganizations();
	const title = "Our Partner Organizations";

	res.render("organizations", { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
	const organizationId = req.params.id;
	const organizationDetails =
		await getOrganizationDetails(organizationId);
	const projects = await getProjectsByOrganizationId(organizationId);
	const title = "Organization Details";

	res.render("organization", { title, organizationDetails, projects });
};

const showNewOrganizationForm = async (req, res) => {
	const title = "Add New Organization";
	res.render("new-organization", { title });
};

/**
 * Creates a new organization in the database.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact email for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */

const processNewOrganizationForm = async (req, res) => {
	const { name, description, contactEmail } = req.body;
	const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations

	const organizationId = await createOrganization(
		name,
		description,
		contactEmail,
		logoFilename,
	);
	res.redirect(`/organization/${organizationId}`);
};

// Export any controller functions
export {
	showOrganizationsPage,
	showOrganizationDetailsPage,
	showNewOrganizationForm,
	processNewOrganizationForm,
};
