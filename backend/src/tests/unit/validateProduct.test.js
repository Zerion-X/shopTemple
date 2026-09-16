import random from "string-random";
import { validate } from "../../routes/products";

describe("validating product", () => {

    describe("validating product`s name", () => {
        
        it(`should return "name" is required if name is not defined`, () => {
            const req = {
                price: 10,
                category_id: 1,
                brand_id: 1
            };

            const res = validate(req);

            expect(res.error).toBeDefined();
            
            expect(res.error.details[0].message).toMatch(`"name" is required`);
        });
        
        it(`should return "name" length must be less than or equal to 255 characters long if length of an name is more than 255`, () => {
            const longName = random(256);
            
            const req = {
                name: longName,
                price: 10,
                category_id: 1,
                brand_id: 1
            };

            const res = validate(req);

            expect(res.error).toBeDefined();

            expect(res.error.details[0].message).toMatch(`"name" length must be less than or equal to 255 characters long`);

        });

        it(`should return "name" must be a string if the input is not type of string`, () => {
            const req = {
                name: 123,
                price: 10,
                category_id: 1,
                brand_id: 1
            };

            const res = validate(req);

            expect(res.error).toBeDefined();

            expect(res.error.details[0].message).toMatch(`"name" must be a string`);

        });

        it(`should return "name" is not allowed to be empty`, () => {
            const req = {
                name: "",
                price: 10,
                category_id: 1,
                brand_id: 1
            };
            
            const res = validate(req);
            
            expect(res.error).toBeDefined();
            
            expect(res.error.details[0].message).toMatch(`"name" is not allowed to be empty`);
            
        });

    });

    describe("validating product`s description", () => {

        it(`should return "description" must be a string if the input is not type of string`, () => {
            const req = {
                name: "lipstick",
                description: 123,
                price: 10,
                category_id: 1,
                brand_id: 1
            };

            const res = validate(req);

            expect(res.error).toBeDefined();

            expect(res.error.details[0].message).toMatch(`"description" must be a string`);

        });

        it("should accept if description is not provided", () => {
            const req = {
                name: "lipstick",
                price: 10,
                category_id: 1,
                brand_id: 1
            };

            const res = validate(req);

            expect(res.error).toBeUndefined();
        });
        
        it(`should accept if description is null `, () => {
            const req = {
                name: "lipstick",
                description: null,
                price: 10,
                category_id: 1,
                brand_id: 1
            };
            
            const res = validate(req);
            
            expect(res.error).toBeUndefined();
                    
        });

        it(`should accept if description is empty `, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 10,
                category_id: 1,
                brand_id: 1
            };
            
            const res = validate(req);
            
            expect(res.error).toBeUndefined();
                    
        });

    });

    describe("validating product`s price", () => {
        
        it(`should return "price" is required if price is not defined`, () => {
            const req = {
                name: "lipstick",
                description: "",
                category_id: 1,
                brand_id: 1
            };

            const res = validate(req);

            expect(res.error).toBeDefined();
            
            expect(res.error.details[0].message).toMatch(`"price" is required`);
        });
        
        it(`should return "price" must be a number if the input is not type of number`, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: "weeee",
                category_id: 1,
                brand_id: 1
            };

            const res = validate(req);

            expect(res.error).toBeDefined();

            expect(res.error.details[0].message).toMatch(`"price" must be a number`);

        });

        it(`should return "price" must be a positive number if the input is non positive`, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 0,
                category_id: 1,
                brand_id: 1
            };

            const req2 = {
                name: "lipstick",
                description: "",
                price: -10,
                category_id: 1,
                brand_id: 1
            };
            
            const res = validate(req);
            const res2 = validate(req2);
            
            expect(res.error).toBeDefined();
            
            expect(res.error.details[0].message).toMatch(`"price" must be a positive number`);
            
            expect(res2.error).toBeDefined();
            
            expect(res2.error.details[0].message).toMatch(`"price" must be a positive number`);
            
        });

        it("should rounds to 2 decimals", () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 10.126,
                category_id: 1,
                brand_id: 1
            };    
            
            const res = validate(req);

            expect(res.error).toBeUndefined();

            expect(res.value.price).toBe(10.13);
        });
        
    });

    describe("validating product`s category_id", () => {
        
        it(`should return "category_id" is required if category_id is not defined`, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 12,
                brand_id: 1
            };

            const res = validate(req);

            expect(res.error).toBeDefined();
            
            expect(res.error.details[0].message).toMatch(`"category_id" is required`);
        });
        
        it(`should return "category_id" must be a number if the input is not type of number`, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 12,
                category_id: "weeee",
                brand_id: 1
            };

            const res = validate(req);

            expect(res.error).toBeDefined();

            expect(res.error.details[0].message).toMatch(`"category_id" must be a number`);

        });

        it(`should return "category_id" must be an integer if the input isn not an integer`, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 10,
                category_id: 12.5,
                brand_id: 1
            };
            
            const res = validate(req);
            
            expect(res.error).toBeDefined();
            
            expect(res.error.details[0].message).toMatch(`"category_id" must be an integer`);
            
        });

        it(`should return "category_id" must be a positive number if the input is non positive`, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 10,
                category_id: 0,
                brand_id: 1
            };

            const req2 = {
                name: "lipstick",
                description: "",
                price: 11,
                category_id: -10,
                brand_id: 1
            };
            
            const res = validate(req);
            const res2 = validate(req2);
            
            expect(res.error).toBeDefined();
            
            expect(res.error.details[0].message).toMatch(`"category_id" must be a positive number`);
            
            expect(res2.error).toBeDefined();
            
            expect(res2.error.details[0].message).toMatch(`"category_id" must be a positive number`);
            
        });
        
    });

    describe("validating product`s brand_id", () => {
        
        it(`should return "brand_id" is required if brand_id is not defined`, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 12,
                category_id: 1
            };

            const res = validate(req);

            expect(res.error).toBeDefined();
            
            expect(res.error.details[0].message).toMatch(`"brand_id" is required`);
        });
        
        it(`should return "brand_id" must be a number if the input is not type of number`, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 12,
                category_id: 1,
                brand_id: "weeee"
            };

            const res = validate(req);

            expect(res.error).toBeDefined();

            expect(res.error.details[0].message).toMatch(`"brand_id" must be a number`);

        });

        it(`should return "brand_id" must be an integer if the input isn not an integer`, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 10,
                category_id: 1,
                brand_id: 12.5
            };
            
            const res = validate(req);
            
            expect(res.error).toBeDefined();
            
            expect(res.error.details[0].message).toMatch(`"brand_id" must be an integer`);
            
        });

        it(`should return "brand_id" must be a positive number if the input is non positive`, () => {
            const req = {
                name: "lipstick",
                description: "",
                price: 10,
                category_id: 1,
                brand_id: 0
            };

            const req2 = {
                name: "lipstick",
                description: "",
                price: 11,
                category_id: 1,
                brand_id: -10
            };
            
            const res = validate(req);
            const res2 = validate(req2);
            
            expect(res.error).toBeDefined();
            
            expect(res.error.details[0].message).toMatch(`"brand_id" must be a positive number`);
            
            expect(res2.error).toBeDefined();
            
            expect(res2.error.details[0].message).toMatch(`"brand_id" must be a positive number`);
            
        });
        
    });

    it(`should return "extra" is not allowed if extra were added in request`, () => {
        const req = {
            name: "lipstick",
            description: "",
            price: 10,
            category_id: 1,
            brand_id: 1,
            extra: "ww"
        };

        const res = validate(req);

        expect(res.error).toBeDefined();

        expect(res.error.details[0].message).toMatch(`"extra" is not allowed`);
    });

    it("should accept a valid product", () => {
        const req = {
            name: "lipstick",
            description: "A nice lipstick",
            price: 19.99,
            category_id: 1,
            brand_id: 1
        };

        const res = validate(req);

        expect(res.error).toBeUndefined();
    });

});
