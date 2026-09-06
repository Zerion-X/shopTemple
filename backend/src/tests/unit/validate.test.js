import random from 'string-random';
import { validate } from "../../routes/auth.js";

describe("Validating user`s email", () => {

    it(`shouldn return "email" is required if email is not defined`, () => {
        const req = {
            password: "12345678",
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"email" is required`);
        expect(loginResult.error.details[0].message).toMatch(`"email" is required`);
        
    });

    it(`should return "email" length must be at least 5 characters long if email is not at least 5 char`, () => {
        const req = {
            email: "test",
            password: "12345678",
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"email" length must be at least 5 characters long`);
        expect(loginResult.error.details[0].message).toMatch(`"email" length must be at least 5 characters long`);
    });

    it(`should return "email" must be a valid email if email is invalid`, () => {
        const req = {
            email: "test1@",
            password: "12345678",
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"email" must be a valid email`);
        expect(loginResult.error.details[0].message).toMatch(`"email" must be a valid email`); 
    });

    it(`should return "email" must be a string if the input is not type of string`, () => { 
        const req = {
            email: 123,
            password: "12345678",
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"email" must be a string`);
        expect(loginResult.error.details[0].message).toMatch(`"email" must be a string`); 
    });

    it(`should return "email" length must be less than or equal to 255 characters long if length of an email is more than 255`, () => {
        const longEmail = random(244) + '@example.com';
        
        const req = {
            email: longEmail,
            password: "12345678",
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"email" length must be less than or equal to 255 characters long`);
        expect(loginResult.error.details[0].message).toMatch(`"email" length must be less than or equal to 255 characters long`); 
    });

    it(`should return "email" is not allowed to be empty`, () => {
        const req = {
            email: "",
            password: "12345678",
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"email" is not allowed to be empty`);
        expect(loginResult.error.details[0].message).toMatch(`"email" is not allowed to be empty`); 
    });

});

describe("Validating user`s password", () => {
    
    it(`shouldn return "password" is required if password is not defined`, () => {
        const req = {
            email: "test@gmail.com",
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"password" is required`);
        expect(loginResult.error.details[0].message).toMatch(`"password" is required`);
        
    });

    it(`should return "password" length must be at least 5 characters long if password is not at least 8 char`, () => {
        const req = {
            email: "test@gmail.com",
            password: "123",
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"password" length must be at least 8 characters long`);
        expect(loginResult.error.details[0].message).toMatch(`"password" length must be at least 8 characters long`);
    });

    it(`should return "password" must be a string if the input is not type of string`, () => { 
        const req = {
            email: "test@gmail.com",
            password: null,
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"password" must be a string`);
        expect(loginResult.error.details[0].message).toMatch(`"password" must be a string`); 
    });

    it(`should return "password" length must be less than or equal to 1024 characters long if length of an password is more than 1024`, () => {
        const longPassword = random(1025);
        
        const req = {
            email: "test@gmail.com",
            password: longPassword,
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"password" length must be less than or equal to 1024 characters long`);
        expect(loginResult.error.details[0].message).toMatch(`"password" length must be less than or equal to 1024 characters long`); 
    });

    it(`should return "password" is not allowed to be empty`, () => {
        const req = {
            email: "test@gmail.com",
            password: "",
            full_name: "test"
        };

        const signupResult = validate(req, true);
        const loginResult = validate(req, false);

        expect(signupResult.error).toBeDefined();
        expect(loginResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"password" is not allowed to be empty`);
        expect(loginResult.error.details[0].message).toMatch(`"password" is not allowed to be empty`); 
    });

});

describe("Validating user`s full_name", () => {
    
    it(`shouldn return "full_name" is required if full_name is not defined`, () => {
        const req = {
            email: "test@gmail.com",
            password: "12345678",
            full_name: undefined
        };

        const signupResult = validate(req);

        expect(signupResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"full_name" is required`);

    });

    it(`should return "full_name" length must be at least 3 characters long if full_name is not at least 3 char`, () => {
        const req = {
            email: "test@gmail.com",
            password: "12345678",
            full_name: "ab"
        };

        const signupResult = validate(req);

        expect(signupResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"full_name" length must be at least 3 characters long`);

    });

    it(`should return "full_name" must be a string if the input is not type of string`, () => { 
        const req = {
            email: "test@gmail.com",
            password: "12345678",
            full_name: 15
        };

        const signupResult = validate(req, true);

        expect(signupResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"full_name" must be a string`);

    });

    it(`should return "full_name" length must be less than or equal to 50 characters long if length of an full_name is more than 50`, () => {
        const longFull_name = random(51);
        
        const req = {
            email: "test@gmail.com",
            password: "12345678",
            full_name: longFull_name
        };

        const signupResult = validate(req, true);

        expect(signupResult.error).toBeDefined();
 
        expect(signupResult.error.details[0].message).toMatch(`"full_name" length must be less than or equal to 50 characters long`);

    });

    it(`should return "full_name" is not allowed to be empty`, () => {
        const req = {
            email: "test@gmail.com",
            password: "12345678",
            full_name: ""
        };

        const signupResult = validate(req, true);

        expect(signupResult.error).toBeDefined();

        expect(signupResult.error.details[0].message).toMatch(`"full_name" is not allowed to be empty`);

    });

});

describe("Validating user", () => {
    
    it("should accept valid signup data", () => {
        const req = {
            email: "test@gmail.com",
            password: "12345678",
            full_name: "test"
        };

        const signupResult = validate(req, true);

        expect(signupResult.message).toBeUndefined();

    });

    it("should accept valid login data", () => {
        const req = {
            email: "test@gmail.com",
            password: "12345678",
        };

        const loginResult = validate(req, false);

        expect(loginResult.message).toBeUndefined();

    });

})