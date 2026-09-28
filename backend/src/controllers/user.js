import { pool } from "../lib/db.js";

async function getCurrentUser(id) {
    const [users] = await pool.execute(
      `SELECT user_id, full_name, email, address, role, created_at
       FROM users WHERE user_id = ? LIMIT 1`,
       [id]  
    );

    return users;
};

async function getAllUsers() {
    const [users] = await pool.execute(
      `SELECT user_id, full_name, email, address, role, created_at
       FROM users`
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

async function updateUser(user_id, full_name, address, password) {
    await pool.execute(
        `UPDATE users SET full_name = ?, password = ?, address = ? WHERE user_id = ?`,
        [full_name, password, address, user_id]
    );
};

async function deleteUserById(user_id) {
    await pool.execute(
        "DELETE FROM users WHERE user_id = ?", 
        [user_id]
    );
}

export { 
    getCurrentUser,
    updateUser,  
    deleteUserById, 
    getCurrentUserForPUT,
    getAllUsers
};