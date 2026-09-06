// CREATE DATABASE shoptemple_test;
// CREATE TABLE shoptemple_test.users LIKE shoptemple.users;
import request from "supertest";
import app from "../../app.js";
import random from 'string-random';
import { createUser } from "../../controllers/signup.js";
import { pool } from "../../lib/db.js";

beforeEach(async () => {
    await createUser(
        "Test User",
        "test@gmail.com",
        "12345678"
    );
});

afterEach(async () => {
    await pool.execute(
        "DELETE FROM users WHERE email = ?",
        ["test@gmail.com"]
    );
});

afterAll(async () => {
    await pool.end();
});

describe("GET /api/auth/me", () => {
    
    it("should return the authenticated user", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "test@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .get("/api/auth/me");

        expect(res.status).toBe(200);

        expect(res.body.email).toBe("test@gmail.com");
    });
});

describe("POST /api/auth/logout", () => {
    
    it("should clear the cookie during logout", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "test@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .post("/api/auth/logout");

        expect(res.status).toBe(200);

        expect(res.headers["set-cookie"]).toBeDefined();

        expect(res.headers["set-cookie"][0]).toMatch(/jwt=;/);
    });
});

describe("POST /api/auth/login", () => {

    it("should login successfully", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@gmail.com",
                password: "12345678"
            });

        expect(res.status).toBe(200);

        expect(res.body).toEqual({
            user_id: expect.any(Number),
            full_name: "Test User",
            email: "test@gmail.com"
        });

        expect(res.headers["set-cookie"]).toBeDefined();
    });


    it("should reject nonexistent email", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "doesnotexist@gmail.com",
                password: "12345678"
            });

        expect(res.status).toBe(401);
        expect(res.text).toBe("Invalid email or password");
    });


    it("should reject wrong password", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@gmail.com",
                password: "wrong-password"
            });

        expect(res.status).toBe(401);
        expect(res.text).toBe("Invalid email or password");
    });


    it("should reject invalid input", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "not-an-email",
                password: "12345678"
            });

        expect(res.status).toBe(400);
        expect(res.text).toBe(`"email" must be a valid email`);
    });

});

describe("POST /api/auth/signup", () => {
    
    it("should signup successfully", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "signuptest@gmail.com",
                password: "signup-pass",
                full_name: "signup-name"
            })

        expect(res.status).toBe(201);

        expect(res.body).toEqual({
            user_id: expect.any(Number),
            full_name: "signup-name",
            email: "signuptest@gmail.com"
        });
    });

    it("should reject duplicate email", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "test@gmail.com",
                password: "signup-pass",
                full_name: "signup-name"            
            })

        expect(res.status).toBe(400);

        expect(res.text).toBe("Email already exists");
    });

    it("should reject invalid input", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "not-an-email",
                password: "signup-pass",
                full_name: "signup-name"
            });
            
            expect(res.status).toBe(400);
        
            expect(res.text).toBe(`"email" must be a valid email`);
    });


});



