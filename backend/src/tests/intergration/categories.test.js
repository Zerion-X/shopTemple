import { createCategory, getCategory, checkDuplicateNames } from "../../controllers/categories";
import { pool } from "../../lib/db";

describe("Validating categories", () => {
    const testCat = {
        name: "test"
    };

    beforeEach(async () => {
        await pool.execute(
            `INSERT INTO categories (name)
            VALUES (?)`,
            [testCat.name]
        );
    });

    afterEach(async () => {
        await pool.execute(
            `DELETE FROM categories WHERE name = ?`,
            [testCat.name]
        );
    });

    afterAll(async () => {
        await pool.end();
    })

    it("should create a category and return its insertId", async () => {
        const res = await createCategory(
            "testingCREATE",
            "test-image-url",
            "test-public-id"
        );

        const [rows] = await pool.execute(
            `SELECT category_id, image_url, image_public_id
            FROM categories
            WHERE name = ?`,
            ["testingCREATE"]
        );

        expect(rows[0]).toEqual(
            expect.objectContaining({
                category_id: expect.any(Number),
                image_url: "test-image-url",
                image_public_id: "test-public-id"
            })
        );

        expect(res.insertId).toEqual(expect.any(Number));
    });

    it("should return categories", async () => {
        const categories = await getCategory();

        expect(categories).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: testCat.name
                })
            ])
        );
    });

    it("should return true if the category name already exists", async () => {
        const res = await checkDuplicateNames("test");

        expect(res).toBe(true);
    });

    it("should return false if the category name does not exist", async () => {
        const res = await checkDuplicateNames("does-not-exist");

        expect(res).toBe(false);
    });

});