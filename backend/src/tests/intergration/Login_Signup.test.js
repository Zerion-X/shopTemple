import { authenticateUser } from "../../controllers/login.js";
import { emailExists, createUser } from "../../controllers/signup.js";
import { pool } from "../../lib/db.js";
import bcrypt from "bcrypt";

describe("LoginUser", () => {
    const testUser = {
        full_name: "Test User",
        email: "test-login@example.com",
        password: "Password123"
    };

    beforeEach(async () => {
        const hashedPassword = await bcrypt.hash(testUser.password, 10);

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
        await pool.execute(
            `DELETE FROM users WHERE email = ?`,
            [testUser.email]
        );
    });

    it("should return null when user does not exist", async () => {
        const result = await authenticateUser(
            "definitely-not-a-user@example.com",
            "Password123"
        );

        expect(result).toBeNull();
    });


    it("should return null when password is incorrect", async () => {
        const result = await authenticateUser(
            testUser.email,
            "WrongPassword123"
        );

        expect(result).toBeNull();
    });


    it("should return user when email and password are valid", async () => {
        const result = await authenticateUser(
            testUser.email,
            testUser.password
        );

        expect(result).toMatchObject({
            full_name: testUser.full_name,
            email: testUser.email
        });

        expect(result.user_id).toEqual(expect.any(Number));
    });

});

describe("SignupUser", () => {
    const Already_User = {
        full_name: "Already User",
        email: "Already-user@gmail.com",
        password: "Password123"
    };

    const testUser = {
        full_name: "Test_User",
        email: "test-signup@gmail.com",
        password: "SignupPassword"
    };

    beforeEach(async () => {
        const hashedPassword = await bcrypt.hash(Already_User.password, 10);

        await pool.execute(
            `INSERT INTO users (full_name, email, password)
            VALUES (?, ?, ?)`,
            [
                Already_User.full_name,
                Already_User.email,
                hashedPassword
            ]
        );
    });

    afterEach(async () => {
        await pool.execute(
            `DELETE FROM users WHERE email IN (?, ?)`,
            [Already_User.email, testUser.email]
        );
    });

    it("should return true if email already exists", async () => {
        const result = await emailExists(Already_User.email);

        expect(result).toBe(true);
    });

    it("should return false if email is new", async () => {
        const result = await emailExists(testUser.email);

        expect(result).toBe(false);
    });

    it("should return user when full_name, email and password are valid", async () => {
        const result = await createUser(
            testUser.full_name,
            testUser.email,
            testUser.password
        );

        expect(result).toMatchObject({
            full_name: testUser.full_name,
            email: testUser.email,
            role: "customer",
        });

        expect(result.user_id).toEqual(expect.any(Number));

        expect(result.created_at).toBeInstanceOf(Date); 

        expect(result.created_at.getTime()).toBeLessThan(Date.now() + 1000); // Created recently

        expect(result.password).toBeUndefined();

    });

    it("should hash the password before storing it", async () => {
        await createUser(
            testUser.full_name,
            testUser.email,
            testUser.password
        );

        const [rows] = await pool.execute(
            `SELECT password FROM users WHERE email = ?`,
            [testUser.email]
        );

       expect(rows[0].password).not.toBe(testUser.password);
    
       expect(rows[0].password).toMatch(/^\$2[aby]\$/);
    });

});

afterAll(async () => {
    await pool.end();
});