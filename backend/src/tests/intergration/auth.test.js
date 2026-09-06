import { jest } from "@jest/globals";
import { auth } from "../../middleware/auth.js";
import { pool } from "../../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("auth middleware", () => {
    const testUser = {
        full_name: "Test User",
        email: "testMiddleware@gmail.com",
        password: "12345678"
    };

    beforeEach(async () => {
        const hashedPassword = await bcrypt.hash(
            testUser.password,
            10
        );

        await pool.execute(
            `INSERT INTO users (full_name, email, password)
             VALUES (?, ?, ?)`,
            [
                testUser.full_name,
                testUser.email,
                hashedPassword
            ]
        );
    });

    afterEach(async () => {
        process.env.REQUIRE_AUTH = "true";

        await pool.execute(
            `DELETE FROM users WHERE email = ?`,
            [testUser.email]
        );
    });

    afterAll(async () => {
        await pool.end();
    });

    it("should authenticate a user with a valid JWT", async () => {
        const [users] = await pool.execute(
            `SELECT user_id, role
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [testUser.email]
        );

        const user = users[0];

        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const req = {
            cookies: {
                jwt: token
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        const next = jest.fn();

        await auth(req, res, next);

        expect(next).toHaveBeenCalled();
        
        expect(req.user).toBeDefined();
        
        expect(req.user.user_id).toBe(user.user_id);

        expect(req.user.email).toBe(testUser.email);
    });

    it("should return 401 when no token is provided", async () => {
        const req = {
            cookies: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        const next = jest.fn();

        await auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        
        expect(res.send).toHaveBeenCalledWith("Access denied. No token provided.");
        
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 when the token is invalid", async () => {
        const req = {
            cookies: {
                jwt: "not-a-valid-jwt"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        const next = jest.fn();

        await auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        
        expect(res.send).toHaveBeenCalledWith("Invalid token");
        
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when the user does not exist", async () => {
        const token = jwt.sign(
            {
                user_id: 999999,
                role: "customer"
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const req = {
            cookies: {
                jwt: token
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        const next = jest.fn();

        await auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        
        expect(res.send).toHaveBeenCalledWith("Access denied. User not found.");
        
        expect(next).not.toHaveBeenCalled();
    });

    it("should skip authentication when REQUIRE_AUTH is false", async () => {
        process.env.REQUIRE_AUTH = "false";

        const req = {
            cookies: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        const next = jest.fn();

        await auth(req, res, next);
        
        expect(req.user).toBeUndefined();
        
        expect(res.status).not.toHaveBeenCalled();
        
        expect(next).toHaveBeenCalled();
    });

});