import { pool } from "../../lib/db";
import {
    getBrands,
    createBrand,
    selectBrandbyId,
    updateBrands,
    getUpdateBrandbyId,
    selectImagePublicId,
    deleteBrandbyId,
    checkDuplicateNames,
    checkDuplicateNameForUpdate
} from "../../controllers/brands";

describe("Validating brands", () => {

    let testBrandId;

    const testBrand = {
        name: "test"
    };

    beforeEach(async () => {
        await pool.execute(
            `INSERT INTO brands (name)
             VALUES (?)`,
            [testBrand.name]
        );

        const [rows] = await pool.execute(
            `SELECT brand_id
             FROM brands
             WHERE name = ?`,
            [testBrand.name]
        );

        testBrandId = rows[0].brand_id;
    });


    afterEach(async () => {
        await pool.execute(
            `DELETE FROM brands
             WHERE name IN (?, ?, ?, ?, ?)`,
            [
                "test",
                "something",
                "testingCREATE",
                "updated-test",
                "delete-test"
            ]
        );
    });


    afterAll(async () => {
        await pool.end();
    });

    it("should create a brand and return its insertId", async () => {
        const res = await createBrand("testingCREATE", "test-image-url", "test-public-id");

        const [rows] = await pool.execute(
            `SELECT
                brand_id,
                name,
                image_url,
                image_public_id
             FROM brands
             WHERE name = ?`,
            ["testingCREATE"]
        );

        expect(rows[0]).toEqual(
            expect.objectContaining({
                brand_id: expect.any(Number),
                name: "testingCREATE",
                image_url: "test-image-url",
                image_public_id: "test-public-id"
            })
        );

        expect(res.insertId).toEqual(expect.any(Number));
    });

    it("should return all brands", async () => {
        const brands = await getBrands();

        expect(brands).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    brand_id: testBrandId,
                    name: "test"
                })
            ])
        );
    });

    it("should return a brand by id", async () => {
        const brands = await selectBrandbyId(testBrandId);

        expect(brands).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    brand_id: testBrandId,
                    name: "test"
                })
            ])
        );
    });

    it("should update a brand", async () => {
        await updateBrands(
            "name = ?",
            ["updated-test", testBrandId]
        );

        const [rows] = await pool.execute(
            `SELECT brand_id, name
             FROM brands
             WHERE brand_id = ?`,
            [testBrandId]
        );

        expect(rows[0]).toEqual(
            expect.objectContaining({
                brand_id: testBrandId,
                name: "updated-test"
            })
        );
    });

    it("should return the updated brand by id", async () => {
        await updateBrands(
            "name = ?",
            ["updated-test", testBrandId]
        );

        const brands = await getUpdateBrandbyId(testBrandId);

        expect(brands).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    brand_id: testBrandId,
                    name: "updated-test"
                })
            ])
        );
    });

    it("should return the image public id of a brand", async () => {
        await pool.execute(
            `UPDATE brands
             SET image_public_id = ?
             WHERE brand_id = ?`,
            ["test-public-id", testBrandId]
        );

        const rows = await selectImagePublicId(testBrandId);

        expect(rows).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    image_public_id: "test-public-id"
                })
            ])
        );
    });

    it("should delete a brand by id", async () => {
        await deleteBrandbyId(testBrandId);

        const [rows] = await pool.execute(
            `SELECT brand_id
             FROM brands
             WHERE brand_id = ?`,
            [testBrandId]
        );

        expect(rows).toHaveLength(0);
    });

    it("should return true if the brand name already exists", async () => {
        const res = await checkDuplicateNames("test");

        expect(res).toBe(true);
    });

    it("should return true if the brand name with a different brand_id already exists", async () => {
        await pool.execute(
            `INSERT INTO brands (name)
             VALUES (?)`,
            ["something"]
        );

        const [rows] = await pool.execute(
            `SELECT brand_id
             FROM brands
             WHERE name = ?`,
            ["something"]
        );

        const testBrand2Id = rows[0].brand_id;

        const res = await checkDuplicateNameForUpdate("test", testBrand2Id);

        expect(res).toBe(true);
    });

    it("should return false if the brand gets updated but keeps its name", async () => {
        const res = await checkDuplicateNameForUpdate("test", testBrandId);

        expect(res).toBe(false);
    });

    it("should return false if the brand name does not exist", async () => {
        const res = await checkDuplicateNames("does-not-exist");

        expect(res).toBe(false);
    });

});