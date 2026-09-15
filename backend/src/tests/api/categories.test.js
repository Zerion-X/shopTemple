import request from "supertest";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../middleware/arcjet.js", () => ({
    default: (req, res, next) => next()
}));

const { default: app } = await import("../../app.js");
import { pool } from "../../lib/db.js";
import { createCategory } from "../../controllers/categories.js";
import { createUser } from "../../controllers/signup.js";

let testCategoryID;
let deleteCategoryID;

beforeEach(async () => {
    const result = await createCategory("Cattest", "test-image-url", "test-public-id");
    const deleteResult = await createCategory("DeleteTest", null, null);

    deleteCategoryID = deleteResult.insertId;
    testCategoryID = result.insertId;

    await createUser(
        "Admin User",
        "adminCategoryTest@gmail.com",
        "12345678"
    );

    await createUser(
        "Customer User",
        "customerCategoryTest@gmail.com",
        "12345678"
    );

    await pool.execute(
        `UPDATE users
         SET role = 'admin'
         WHERE email = ?`,
        ["adminCategoryTest@gmail.com"]
    );
});

afterEach(async () => {
    await pool.execute(
        "DELETE FROM categories WHERE name IN (?, ?, ?, ?)",
        ["Cattest", "DeleteTest", "testingCREATE", "valid-name"]
    );

    await pool.execute(
        "DELETE FROM users WHERE email IN (?, ?)",
        ["adminCategoryTest@gmail.com", "customerCategoryTest@gmail.com"]
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
                email: "adminCategoryTest@gmail.com",
                password: "12345678"
            });

        const res = await agent.get("/api/categories");

        expect(res.status).toBe(200);

        expect(res.body).toEqual(expect.any(Array));

        const category = res.body.find(
            category => category.name === "Cattest"
        );

        expect(category).toEqual(
            expect.objectContaining({
                category_id: expect.any(Number),
                name: "Cattest",
                image_url: "test-image-url"
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
                email: "adminCategoryTest@gmail.com",
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
                email: "adminCategoryTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .post("/api/categories")
            .send({
                name: "Cattest"
            });

        expect(res.status).toBe(409);
    });


    it("should return 201 if the input is valid", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminCategoryTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .post("/api/categories")
            .send({
                name: "valid-name",
            });

        expect(res.status).toBe(201);
    });

});

describe("PATCH /api/categories/:id", () => {
    
    it("should return 404 if there is no category with specified id", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminCategoryTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .patch("/api/categories/999")
            .send({
                name: "something-something"
            });
        
        expect(res.status).toBe(404);

        expect(res.body.error).toBe("category not found");
        
    });

    it("should return 400 if input object is not valid", async () =>{
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminCategoryTest@gmail.com",
                password: "12345678" 
            });
        
        const res = await agent
            .patch(`/api/categories/${testCategoryID}`)
            .send({
                name: 123
            });

        expect(res.status).toBe(400);
        
        expect(res.body.error).toBe('"name" must be a string');

    });

    it("should return 400 if there is not field to update", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminCategoryTest@gmail.com",
                password: "12345678" 
            });
        
        const res = await agent
            .patch(`/api/categories/${testCategoryID}`)
            .send({

            }); 

        expect(res.status).toBe(400);

        expect(res.body.error).toBe("No fields to update");
    });

    it("should return 200 and the updated category if everything is valid", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminCategoryTest@gmail.com",
                password: "12345678" 
            });
        
        const res = await agent
            .patch(`/api/categories/${testCategoryID}`)
            .send({
                name: "new_test_name"
            }); 

            expect(res.status).toBe(200);

            expect(res.body).toEqual(
                expect.objectContaining({
                    category_id: expect.any(Number),
                    name: "new_test_name",
                    image_url: "test-image-url",
                })
            );
        });

});

describe("DELETE /api/categories/:id", () => {
    
    it("should return 404 if there is no category with the specified id", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminCategoryTest@gmail.com",
                password: "12345678"
            });
        
        const res = await agent
            .delete("/api/categories/999")
            
        expect(res.status).toBe(404);

        expect(res.body.error).toBe("category not found");

    });

    it("should return 204 when the category is deleted successfully", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminCategoryTest@gmail.com",
                password: "12345678"       
            });
        
        const res = await agent
            .delete(`/api/categories/${deleteCategoryID}`)
        
        expect(res.status).toBe(204);
    });

});

describe(" Customer requesting", () =>{
    
    it("should return 403 if customer requesting POST", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "customerCategoryTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .post("/api/categories")
            .send({
                name: "something-something"
            });
        
        expect(res.status).toBe(403);

        expect(res.text).toBe("Access Denied!");

    });

    it("should return 403 if customer requesting PATCH", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "customerCategoryTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .patch("/api/categories/999")
            .send({
                name: "something-something"
            });
        
        expect(res.status).toBe(403);

        expect(res.text).toBe("Access Denied!");

    });

    it("should return 403 if customer requesting DELETE", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "customerCategoryTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .delete("/api/categories/999")
            .send({
                name: "something-something"
            });
        
        expect(res.status).toBe(403);

        expect(res.text).toBe("Access Denied!");

    });

    it("should return 200 if customer requesting GET", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "customerCategoryTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .get("/api/categories")
        
        expect(res.status).toBe(200);

    });
})
