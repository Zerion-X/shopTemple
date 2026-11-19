import jwt from "jsonwebtoken";
import { pool } from "../lib/db.js";

async function auth(req, res, next) {
    if (process.env.REQUIRE_AUTH === "false") return next();

    const token = req.cookies.jwt;
    if (!token) return res.status(401).send("Access denied. No token provided.");

    let decoded;
    try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (ex) {
        console.error("JWT Verification Error:", ex.message);
        return res.status(401).send("Invalid token");
    }
    try {
        const [users] = await pool.execute(
            "SELECT user_id, full_name, email, role, created_at FROM users WHERE user_id = ? LIMIT 1",
            [decoded.user_id]
        );
        if (users.length === 0) {
            return res.status(401).send("Access denied. User not found.");
        }

        req.user = users[0];
        next();
    } catch (err) {
        next(err);
    }
}

export { auth };