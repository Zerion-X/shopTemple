import request from "supertest";
import app from "../../app.js";
import { pool } from "../../lib/db.js";
import { createCategory } from "../../controllers/categories.js";
import { createUser } from "../../controllers/signup.js";

beforeEach(async () => {
    await createCategory("test");

    await createUser(
        "Admin User",
        "adminTest@gmail.com",
        "12345678"
    );

    await pool.execute(
        `UPDATE users
         SET role = 'admin'
         WHERE email = ?`,
        ["adminTest@gmail.com"]
    );
});

afterEach(async () => {
    await pool.execute(
        "DELETE FROM categories WHERE name IN (?, ?)",
        ["test", "valid-name"]
    );

    await pool.execute(
        "DELETE FROM users WHERE email = ?",
        ["adminTest@gmail.com"]
    );
});

afterAll(async () => {
    await pool.end();
});


describe("GET /api/categories", () => {

    it("should return the categories", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminTest@gmail.com",
                password: "12345678"
            });

        const res = await agent.get("/api/categories");

        expect(res.status).toBe(200);

        expect(res.body).toEqual(expect.any(Array));

        expect(res.body[0]).toEqual(
            expect.objectContaining({
                category_id: expect.any(Number),
                name: expect.any(String)
            })
        );
    });

});


describe("POST /api/categories", () => {

    it("should return 400 if the input is invalid", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .post("/api/categories")
            .send({
                name: 123
            });

        expect(res.status).toBe(400);

        expect(res.text).toBe(`"name" must be a string`);
    });


    it("should return 409 if the category already exists", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .post("/api/categories")
            .send({
                name: "test"
            });

        expect(res.status).toBe(409);
    });


    it("should return 201 if the input is valid", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .post("/api/categories")
            .send({
                name: "valid-name"
            });

        expect(res.status).toBe(201);

        expect(res.body).toEqual({
            id: expect.any(Number),
            name: "valid-name"
        });
    });

});

