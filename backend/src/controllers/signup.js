import {pool} from "../lib/db.js";
import bcrypt from "bcrypt";

async function emailExists(email) {
    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
        `SELECT user_id 
        FROM users
        WHERE email= ? 
        LIMIT 1`,
        [normalizedEmail]
    );

    return users.length > 0 ? true : false;
}   

async function createUser(fullName, email, password) {
    
    const normalizedEmail = email.trim().toLowerCase();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.execute(
        `INSERT INTO users (full_name, email, password)
        VALUES (?, ?, ?)`,
        [fullName, normalizedEmail, hashedPassword]
        );
    
    const userId = result.insertId;

    const [rows] = await pool.execute(
        `SELECT user_id, full_name, email, created_at, role
        FROM users
        WHERE user_id = ?`,
        [userId]
     );

    const user = rows[0];

    return { user, userId };
}

export { emailExists, createUser };
