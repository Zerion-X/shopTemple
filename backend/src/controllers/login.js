import {pool} from "../lib/db.js";
import bcrypt from "bcrypt";

async function authenticateUser(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
        `SELECT 
            user_id, 
            password, 
            full_name, 
            email,
            role,
            created_at
        FROM users
        WHERE email = ?
        LIMIT 1`,
        [normalizedEmail]
    )

    if (users.length === 0) return null;
    
    const user = users[0];
    const userId = user.user_id;
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return null;

    return { user, userId };
}

export { authenticateUser };
