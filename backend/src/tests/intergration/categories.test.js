import { createCategory, getCategory, checkDuplicateNames, checkDuplicateNameForUpdate } from "../../controllers/categories";
import { pool } from "../../lib/db";

describe("Validating categories", () => {
    let testCatId;
    
    const testCat = {
        name: "test"
    };

    beforeEach(async () => {
        await pool.execute(
            `INSERT INTO categories (name)
            VALUES (?)`,
            [testCat.name]
        );

        const [rows] = await pool.execute(
            `SELECT category_id FROM categories WHERE name = ?`,
            [testCat.name]
        );

        testCatId = rows[0].category_id;
    });

    afterEach(async () => {
        await pool.execute(
            `DELETE FROM categories
            WHERE name IN (?, ?, ?)`,
            [
                "test",
                "something",
                "testingCREATE"
            ]
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

    it("should return true if the category name with different category_id already exists", async () => {
        await pool.execute(
            `INSERT INTO categories (name)
            VALUES (?)`,
            ["something"]
        );

        const [rows] = await pool.execute(
            `SELECT category_id FROM categories WHERE name = ?`,
            ["something"]
        );

        const testCat2Id = rows[0].category_id;
        
        const res = await checkDuplicateNameForUpdate("test", testCat2Id);

        expect(res).toBe(true);
    });

    it("should return false if the category get updated but keep it`s name", async () => {
        const res = await checkDuplicateNameForUpdate("test", testCatId);

        expect(res).toBe(false);
    });

    it("should return false if the category name does not exist", async () => {
        const res = await checkDuplicateNames("does-not-exist");

        expect(res).toBe(false);
    });

});