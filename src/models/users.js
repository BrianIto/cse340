import bcrypt from "bcrypt";
import db from "./db.js";

const createUser = async (name, email, passwordHash) => {
	const result = await db.query(
		`INSERT INTO users (name, email, password_hash, role_id)
		 VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
		 RETURNING user_id;`,
		[name, email, passwordHash, "user"],
	);

	if (result.rows.length === 0) {
		throw new Error("Failed to create user");
	}

	return result.rows[0].user_id;
};

const getAllUsers = async () => {
	const result = await db.query(
		`SELECT u.user_id, u.name, u.email, r.role_name
		 FROM users u
		 JOIN roles r ON u.role_id = r.role_id
		 ORDER BY u.name, u.email;`,
	);
	return result.rows;
};

const findUserByEmail = async (email) => {
	const result = await db.query(
		`SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
		 FROM users u
		 JOIN roles r ON u.role_id = r.role_id
		 WHERE u.email = $1;`,
		[email],
	);
	return result.rows[0] ?? null;
};

const verifyPassword = async (password, passwordHash) =>
	bcrypt.compare(password, passwordHash);

const authenticateUser = async (email, password) => {
	const user = await findUserByEmail(email);
	if (!user || !(await verifyPassword(password, user.password_hash))) {
		return null;
	}

	delete user.password_hash;
	return user;
};

export { createUser, authenticateUser, getAllUsers };
