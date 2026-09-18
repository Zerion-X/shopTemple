import request from "supertest";
import { afterAll, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule("../../middleware/arcjet.js", () => ({
    default: (req, res, next) => next()
}));

const { default: app } = await import("../../app.js");
import { pool } from "../../lib/db.js";
import { createBrand } from "../../controllers/brands.js";
import { createUser } from "../../controllers/signup.js";


let testbrandID;
let deletebrandID;

beforeEach(async () => {
    await pool.execute(
        `DELETE FROM users
         WHERE email IN (?, ?)`,
         [
            "adminBrandTest@gmail.com",
            "customerBrandTest@gmail.com"
         ]
    );
    
    const result = await createBrand("Brandtest", "test-image-url", "test-public-id");
    const deleteResult = await createBrand("Deletetest", null, null);

    testbrandID = result.insertId;
    deletebrandID = deleteResult.insertId;

    await createUser(
        "Admin User",
        "adminBrandTest@gmail.com",
        "12345678"
    );

    await createUser(
        "Customer User",
        "customerBrandTest@gmail.com",
        "12345678"
    );

    await pool.execute(
        `UPDATE users
         SET role = 'admin'
         WHERE email = ?`,
         ["adminBrandTest@gmail.com"]
    );
});

afterEach(async () => {
    await pool.execute(
      `DELETE FROM brands
       WHERE name IN (?, ?, ?, ?, ?)`,
       [
            "Brandtest",
            "Deletetest",
            "valid-brand-name",
            "new-test-name",
            "new-valid-test-name"
       ]  
    );

    await pool.execute(
        `DELETE FROM users
         WHERE email IN (?, ?)`,
         [
            "adminBrandTest@gmail.com",
            "customerBrandTest@gmail.com"
         ]
    );
});

afterAll(async () => {
    await pool.end();
});

describe("GET /api/brands", () => {
    
    it("should return the brands", async () => {
        const res = await request(app)
            .get("/api/brands")

        expect(res.status).toBe(200);

        expect(res.body).toEqual(expect.any(Array));

        const brand = res.body.find(
            brand => brand.name === "Brandtest"
        );

        expect(brand).toEqual(
            expect.objectContaining({
                brand_id: expect.any(Number),
                name: "Brandtest",
                image_url: "test-image-url"
            })
        );
    });

});

describe("POST /api/brands", () => {

    it("should return 400 if the input is invalid", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminBrandTest@gmail.com",
                password: "12345678"
            });
        
        const res = await agent
            .post("/api/brands")
            .send({
                name: 123
            });

        expect(res.status).toBe(400);

        expect(res.text).toBe(`"name" must be a string`);
    });

    it("should return 409 if the brand already exists", async () => {
        const agent = request.agent(app);

        await agent 
            .post("/api/auth/login")
            .send({
                email: "adminBrandTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .post("/api/brands")
            .send({
                name: "Brandtest"
            });

        expect(res.status).toBe(409);
    });

    it("should return 201 if the input is valid", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminBrandTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .post("/api/brands")
            .send({
                name: "valid-brand-name"
            });

        expect(res.status).toBe(201);

        expect(res.body).toEqual(
            expect.objectContaining({
                brand_id: expect.any(Number),
                name: "valid-brand-name",
            })
        );
    });

});

describe("PATCH /api/brands/:id", () => {

    it("should return 404 if there is no brand with specified id", async () => {
        const agent = request.agent(app);

        await agent 
            .post("/api/auth/login")
            .send({
                email: "adminBrandTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .patch("/api/brands/99999")
            .send({
                name: "something"
            });

        expect(res.status).toBe(404);

        expect(res.body.error).toBe("Brand not found");

    });

    it("should return 400 if the input object is not valid", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminBrandTest@gmail.com",
                password: "12345678"
            });
        
        const res = await agent
            .patch(`/api/brands/${testbrandID}`)
            .send({
                name: 123
            });

        expect(res.status).toBe(400);

        expect(res.body.error).toBe(`"name" must be a string`);

    });

    it("should return 409 if such name already exists", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminBrandTest@gmail.com",
                password: "12345678"
            });
        
        const new_test = await createBrand("new-test-name", "new-image-url", "new-imagePublicId");
        const newId = new_test.insertId;

        const res = await agent
            .patch(`/api/brands/${newId}`)
            .send({
                name: "Brandtest"
            });

        expect(res.status).toBe(409);

        expect(res.body.error).toBe("Such name already exists");
    });

    it("should return 400 if there is not field to update", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminBrandTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .patch(`/api/brands/${testbrandID}`)
            .send({
                        
            });

        expect(res.status).toBe(400);

        expect(res.body.error).toBe(`No fields to update`);
    });

    it("should return 200 and the updated brand if everything is valid", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminBrandTest@gmail.com",
                password: "12345678"
            });
            
        const res = await agent
            .patch(`/api/brands/${testbrandID}`)
            .send({
                name: "new-valid-test-name"
            });

        expect(res.status).toBe(200);

        expect(res.body).toEqual(
            expect.objectContaining({
                brand_id: expect.any(Number),
                name: "new-valid-test-name",
                image_url: "test-image-url",
            })
        );

    });

});

describe("DELETE /api/brands/:id", () => {

    it("should return 404 if there is no brand with the specified id", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminBrandTest@gmail.com",
                password: "12345678"
            });
        
        const res = await agent
            .delete("/api/brands/99999");
        
        expect(res.status).toBe(404);

        expect(res.body.error).toBe("Brand not found");

    });

    it("should return 204 when the brand is deleted successfully", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "adminBrandTest@gmail.com",
                password: "12345678"
            });

        const res = await agent
            .delete(`/api/brands/${deletebrandID}`);

        expect(res.status).toBe(204);

    });

});

describe("Customer requesting", () => {

    it("should return 403 if customer requesting POST", async () => {
        const agent = request.agent(app);

        await agent
            .post("/api/auth/login")
            .send({
                email: "customerBrandTest@gmail.com",
                password: "12345678"
            });
        
        const res = await agent
            .post("/api/brands")
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
                email: "customerBrandTest@gmail.com",
                password: "12345678"
            });
        
        const res = await agent
            .patch("/api/brands/99999")
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
                email: "customerBrandTest@gmail.com",
                password: "12345678"
            });
        
        const res = await agent
            .delete("/api/brands/999999");
        
        expect(res.status).toBe(403);

        expect(res.text).toBe("Access Denied!");
    });

    it("should return 200 while requesting GET", async () => {        
        const res = await request(app)
            .get("/api/brands");
        
        expect(res.status).toBe(200);

    });

});