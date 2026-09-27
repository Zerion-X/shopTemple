import { pool } from "../lib/db.js";

async function getCurrentUser(id) {
    const [users] = await pool.execute(
      `SELECT user_id, full_name, email, address, role, created_at
       FROM users WHERE user_id = ? LIMIT 1`,
       [id]  
    );

    return users;
};

async function getCurrentUserForPUT(id) {
    const [users] = await pool.execute(
      `SELECT user_id, full_name, password, email, address, role, created_at
       FROM users WHERE user_id = ? LIMIT 1`,
       [id]  
    );

    return users;
};

async function updateUser(user_id, email, password, full_name, address) {
    await pool.execute(
        `UPDATE users SET email = ?, password = ?, full_name = ?, address = ? WHERE user_id = ?`,
        [email, password, full_name, address, user_id]
    );
};

async function deleteUserById(user_id) {
    await pool.execute(
        "DELETE FROM users WHERE user_id = ?", 
        [user_id]
    );
}

async function emailExistsForOtherUser(email, user_id) {
    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
        `SELECT user_id 
        FROM users
        WHERE email= ? AND user_id != ?
        LIMIT 1`,
        [normalizedEmail, user_id]
    );

    return users.length > 0 ? true : false;
}

export { 
    getCurrentUser,
    updateUser,  
    deleteUserById, 
    emailExistsForOtherUser,
    getCurrentUserForPUT
};