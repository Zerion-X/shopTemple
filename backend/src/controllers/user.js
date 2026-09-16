import { pool } from "../lib/db.js";

async function getCurrentUser(id) {
    const [users] = await pool.execute(
      `SELECT user_id, full_name, email, role, created_at
       FROM users WHERE user_id = ? LIMIT 1`,
       [id]  
    );

    return users;
};

export { getCurrentUser };