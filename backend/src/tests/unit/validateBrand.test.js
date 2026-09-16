import random from "string-random";
import { validate } from "../../routes/brands";

describe("Validating brand`s name", () => {

    it(`should return "name" is required if name is not defined`, () => {
        const req = {
        };

        const res = validate(req);

        expect(res.error).toBeDefined();

        expect(res.error.details[0].message).toMatch(`"name" is required`);
    });

    it(`should return "name" length must be at least 3 characters long if name is not at least 3 char`, () => {
        const req = {
            name: "12"
        };

        const res = validate(req);

        expect(res.error).toBeDefined();

        expect(res.error.details[0].message).toMatch(`"name" length must be at least 3 characters long`);

    });
    
    it(`should return "name" length must be less than or equal to 45 characters long if length of an name is more than 50`, () => {
        const longName = random(46);
        
        const req = {
            name: longName
        };

        const res = validate(req);

        expect(res.error).toBeDefined();

        expect(res.error.details[0].message).toMatch(`"name" length must be less than or equal to 45 characters long`);

    });

    it(`should return "name" must be a string if the input is not type of string`, () => {
        const req = {
            name: 123
        };

        const res = validate(req);

        expect(res.error).toBeDefined();

        expect(res.error.details[0].message).toMatch(`"name" must be a string`);

    });

    it(`should return "name" is not allowed to be empty`, () => {
        const req = {
            name: ""
        };

        const res = validate(req);

        expect(res.error).toBeDefined();

        expect(res.error.details[0].message).toMatch(`"name" is not allowed to be empty`);

    });

    it(`should return "extra" is not allowed if extra were added in request`, () => {
        const req = {
            name: "test",
            extra: 123
        };

        const res = validate(req);

        expect(res.error).toBeDefined();

        expect(res.error.details[0].message).toMatch(`"extra" is not allowed`);
    });

    it("should accept a valid brand name", () => {
        const req = {
            name: "Nike"
        };

        const res = validate(req);

        expect(res.error).toBeUndefined();
    });

});