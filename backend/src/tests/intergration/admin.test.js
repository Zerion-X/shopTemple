import bcrypt from "bcrypt";
import { pool } from "../../lib/db";
import { jest } from "@jest/globals";
import admin from "../../middleware/admin";

describe("admin middleware", () => {
    const customerUser = {
        full_name: "Customer User",
        email: "customerTest@gmail.com",
        password: "12345678"
    };

    const adminUser = {
        full_name: "Admin User",
        email: "adminTest@gmail.com",
        password: "12345678",
        role: "admin"
    };

    beforeEach(async () => {
        await pool.execute(
            `DELETE FROM users
             WHERE email IN (?, ?)`,
             [customerUser.email, adminUser.email]
        );
        
        const hashedCustomerPassword = await bcrypt.hash(
            customerUser.password,
            10
        );

        const hashedAdminPassword = await bcrypt.hash(
            adminUser.password,
            10
        );

        await pool.execute(
            `INSERT INTO users (full_name, email, password)
            VALUES (?, ?, ?)`,
            [
                customerUser.full_name,
                customerUser.email,
                hashedCustomerPassword,
            ]
        );

        await pool.execute(
            `INSERT INTO users (full_name, email, password, role)
            VALUES (?, ?, ?, ?)`,
            [
                adminUser.full_name,
                adminUser.email,
                hashedAdminPassword,
                adminUser.role
            ]
        );
    });

    afterEach(async () => {
        process.env.REQUIRE_AUTH = "true";
        
        await pool.execute(
            `DELETE FROM users WHERE email = ?`,
            [customerUser.email]
        );

        await pool.execute(
            `DELETE FROM users WHERE email = ?`,
            ["adminTest@gmail.com"]
        );
    });

    afterAll(async () => {
        await pool.end();
    });

    it("should call next() for admin", async () => {
        const [adminUsers] = await pool.execute(
          `SELECT role
           FROM users
           WHERE email= ?
           LIMIT 1`,
           [adminUser.email]  
        );

        const user = adminUsers[0];

        const req = {
            user: user
        };  

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        const next = jest.fn();

        await admin(req, res, next);

        expect(next).toHaveBeenCalled();
        
        expect(res.status).not.toHaveBeenCalled();   

    });

    it("should return 403 for customer", async () => {
        const [customerUsers] = await pool.execute(
            `SELECT role
            FROM users
            WHERE email = ?
            LIMIT 1`,
            [customerUser.email]
        );

        const user = customerUsers[0];

        const req = {
            user: user
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        const next = jest.fn();

        await admin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith("Access Denied!");
        expect(next).not.toHaveBeenCalled();
    });

});
