import { pool } from "../../lib/db";
import {
    getProducts,
    validateCategoryId,
    validateBrandId,
    createProduct,
    selectProductbyId,
    updateProductbyId,
    updateProducts,
    selectImagePublicId,
    deleteProductbyId,
    checkDuplicateNameForUpdate,
    checkDuplicateNames
} from "../../controllers/products";


describe("validating products", () => {
    let testProductId;
    let testCategoryId;
    let testBrandId;

    const testProductName = "product-test";
    const testCategoryName = "category-test";
    const testBrandName = "brand-test";

    beforeEach(async () => {
        await pool.execute(
            `DELETE FROM products WHERE name IN (?, ?, ?)`,
            [testProductName, "testingCREATE", "updated-test"]
        );

        await pool.execute(
            `DELETE FROM categories WHERE name = ?`,
            [testCategoryName]
        );

        await pool.execute(
            `DELETE FROM brands WHERE name = ?`,
            [testBrandName]
        );

        await pool.execute(
            `INSERT INTO categories (name)
             VALUES (?)`,
            [testCategoryName]
        );

        const [categoryRows] = await pool.execute(
            `SELECT category_id
             FROM categories
             WHERE name = ?`,
            [testCategoryName]
        );

        testCategoryId = categoryRows[0].category_id;

        await pool.execute(
            `INSERT INTO brands (name)
             VALUES (?)`,
            [testBrandName]
        );

        const [brandRows] = await pool.execute(
            `SELECT brand_id
             FROM brands
             WHERE name = ?`,
            [testBrandName]
        );

        testBrandId = brandRows[0].brand_id;

        await pool.execute(
            `INSERT INTO products (name, description, price, category_id, brand_id)
             VALUES (?, ?, ?, ?, ?)`,
            [testProductName, "test description", 25.99, testCategoryId, testBrandId]
        );

        const [productRows] = await pool.execute(
            `SELECT product_id
             FROM products
             WHERE name = ?`,
            [testProductName]
        );

        testProductId = productRows[0].product_id;
    });


    afterEach(async () => {
        await pool.execute(
            `DELETE FROM products
            WHERE name IN (?, ?, ?, ?, ?)`,
            [testProductName, "testingCREATE", "updated-test", "something", "delete-test"]
        );

        await pool.execute(
            `DELETE FROM categories
             WHERE name = ?`,
            [testCategoryName]
        );

        await pool.execute(
            `DELETE FROM brands
             WHERE name = ?`,
            [testBrandName]
        );
    });

    afterAll(async () => {
        await pool.end();
    });

    it("should return products", async () => {
        const products = await getProducts();

        expect(products).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    product_id: testProductId,
                    name: testProductName,
                    description: "test description",
                    brand_id: testBrandId,
                    category_id: testCategoryId
                })
            ])
        );
    });

    it("should return true if the category exists", async () => {
        const res = await validateCategoryId(testCategoryId);

        expect(res).toBe(true);
    });

    it("should return false if the category does not exist", async () => {
        const res = await validateCategoryId(99999);

        expect(res).toBe(false);
    });

    it("should return true if the brand exists", async () => {
        const res = await validateBrandId(testBrandId);

        expect(res).toBe(true);
    });

    it("should return false if the brand does not exist", async () => {
        const res = await validateBrandId(99999);

        expect(res).toBe(false);
    });

    it("should create a product and return its insertId", async () => {
        const res = await createProduct(
            "testingCREATE",
            "created product",
            49.99,
            testCategoryId,
            testBrandId,
            "test-image-url",
            "test-public-id"
        );

        const [rows] = await pool.execute(
            `SELECT
                product_id,
                name,
                description,
                price,
                category_id,
                brand_id,
                image_url,
                image_public_id
             FROM products
             WHERE name = ?`,
            ["testingCREATE"]
        );

        expect(rows[0]).toEqual(
            expect.objectContaining({
                product_id: expect.any(Number),
                name: "testingCREATE",
                description: "created product",
                category_id: testCategoryId,
                brand_id: testBrandId,
                image_url: "test-image-url",
                image_public_id: "test-public-id"
            })
        );

        expect(Number(rows[0].price)).toBe(49.99);
          
        expect(res.insertId).toEqual(expect.any(Number));
    });

    it("should return a product by id", async () => {
        const res = await selectProductbyId(testProductId);

        expect(res).toHaveLength(1);

        expect(res[0]).toEqual(
            expect.objectContaining({
                product_id: testProductId,
                name: testProductName,
                description: "test description",
                category_id: testCategoryId,
                brand_id: testBrandId
            })
        );
    });

    it("should update a product by id", async () => {
        await updateProductbyId(
            "updated-test",
            "updated description",
            39.99,
            testCategoryId,
            testBrandId,
            "updated-image-url",
            "updated-public-id",
            testProductId
        );

        const [rows] = await pool.execute(
            `SELECT
                name,
                description,
                price,
                category_id,
                brand_id,
                image_url,
                image_public_id
             FROM products
             WHERE product_id = ?`,
            [testProductId]
        );

        expect(rows[0]).toEqual(
            expect.objectContaining({
                name: "updated-test",
                description: "updated description",
                category_id: testCategoryId,
                brand_id: testBrandId,
                image_url: "updated-image-url",
                image_public_id: "updated-public-id"
            })
        );

        expect(Number(rows[0].price)).toBe(39.99);
    });

    it("should update selected product fields", async () => {
        await updateProducts(
            "name = ?, price = ?",
            ["updated-test", 59.99, testProductId]
        );

        const [rows] = await pool.execute(
            `SELECT
                name,
                price,
                description
             FROM products
             WHERE product_id = ?`,
            [testProductId]
        );

        expect(rows[0]).toEqual(
            expect.objectContaining({
                name: "updated-test",
                description: "test description"
            })
        );

        expect(Number(rows[0].price)).toBe(59.99);
    });

    it("should return the product image public id", async () => {
        await pool.execute(
            `UPDATE products
             SET image_public_id = ?
             WHERE product_id = ?`,
            ["test-public-id", testProductId]
        );

        const res = await selectImagePublicId(testProductId);

        expect(res[0]).toEqual({
            image_public_id: "test-public-id"
        });
    });

    it("should delete a product by id", async () => {
        const [result] = await pool.execute(
            `INSERT INTO products (name, description, price, category_id, brand_id)
             VALUES (?, ?, ?, ?, ?)`,
            ["delete-test", "product to delete", 20, testCategoryId, testBrandId]
        );

        const productId = result.insertId;

        await deleteProductbyId(productId);

        const [rows] = await pool.execute(
            `SELECT product_id
             FROM products
             WHERE product_id = ?`,
            [productId]
        );

        expect(rows).toHaveLength(0);
    });

    it("should return true if a product name already exists", async () => {
        const res = await checkDuplicateNames(testProductName);

        expect(res).toBe(true);
    });

    it("should return false if a product name does not exist", async () => {
        const res = await checkDuplicateNames("does-not-exist");

        expect(res).toBe(false);
    });

    it("should return true if another product has the same name", async () => {
        await pool.execute(
            `INSERT INTO products (name, description, price, category_id, brand_id)
            VALUES (?, ?, ?, ?, ?)`,
            ["something", "another product", 30, testCategoryId, testBrandId]
        );

        const [rows] = await pool.execute(
            `SELECT product_id
             FROM products
             WHERE name = ?`,
             ["something"]
        );

        const testProduct2Id = rows[0].product_id;

        const res = await checkDuplicateNameForUpdate(testProductName, testProduct2Id);

        expect(res).toBe(true);
    });

    it("should return false if the product keeps its own name during update", async () => {
        const res = await checkDuplicateNameForUpdate(testProductName, testProductId);

        expect(res).toBe(false);
    });
});