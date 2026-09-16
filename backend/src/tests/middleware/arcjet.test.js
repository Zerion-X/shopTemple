import { jest } from "@jest/globals";

const protect = jest.fn();

jest.unstable_mockModule("../../lib/arcjet.js", () => ({
    default: {
        protect
    }
}));

jest.unstable_mockModule("@arcjet/inspect", () => ({
    isSpoofedBot: jest.fn()
}));

const { default: arcjetProtect } = await import(
    "../../middleware/arcjet.js"
);

const { isSpoofedBot } = await import("@arcjet/inspect");


describe("Arcjet middleware", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    it("should call next if the request is allowed", async () => {
        protect.mockResolvedValue({
            isDenied: () => false,
            results: []
        });

        const req = {};
        const res = {};
        const next = jest.fn();

        await arcjetProtect(req, res, next);

        expect(next).toHaveBeenCalled();
    });


    it("should return 429 if the request is rate limited", async () => {
        protect.mockResolvedValue({
            isDenied: () => true,
            reason: {
                isRateLimit: () => true,
                isBot: () => false
            },
            results: []
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const next = jest.fn();

        await arcjetProtect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.send).toHaveBeenCalledWith("Rate limit exceeded");
        expect(next).not.toHaveBeenCalled();
    });


    it("should return 403 if a bot is detected", async () => {
        protect.mockResolvedValue({
            isDenied: () => true,
            reason: {
                isRateLimit: () => false,
                isBot: () => true
            },
            results: []
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const next = jest.fn();

        await arcjetProtect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith("Bot detected");
        expect(next).not.toHaveBeenCalled();
    });


    it("should return 403 for other denied requests", async () => {
        protect.mockResolvedValue({
            isDenied: () => true,
            reason: {
                isRateLimit: () => false,
                isBot: () => false
            },
            results: []
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const next = jest.fn();

        await arcjetProtect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith("Access denied by Arcjet");
        expect(next).not.toHaveBeenCalled();
    });


    it("should return 403 if a spoofed bot is detected", async () => {
        isSpoofedBot.mockReturnValue(true);

        protect.mockResolvedValue({
            isDenied: () => false,
            results: [{}]
        });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const next = jest.fn();

        await arcjetProtect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith("Spoofed bot detected");
        expect(next).not.toHaveBeenCalled();
    });


    it("should call next if Arcjet throws an error", async () => {
        const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});
        
        protect.mockRejectedValue(new Error("Arcjet error"));

        const req = {};
        const res = {};
        const next = jest.fn();

        await arcjetProtect(req, res, next);

        expect(next).toHaveBeenCalled();

        consoleError.mockRestore();
    });

});

