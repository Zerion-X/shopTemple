import { jest } from "@jest/globals";

jest.unstable_mockModule("jsonwebtoken", () => ({
    default: {
        sign: jest.fn()
    }
}));

const { default: jwt } = await import("jsonwebtoken");
const { generateAuthToken } = await import("../../lib/utils.js");

describe("generateAuthToken", () => {
    let mockRes;

    const mockUser = {
        user_id: 1,
        role: "customer"
    };

    const mockToken = "mock.jwt.token";

    beforeEach(() => {
        jest.clearAllMocks();

        mockRes = {
            cookie: jest.fn()
        };

        jwt.sign.mockReturnValue(mockToken);

        process.env.JWT_SECRET = "test-secret";
        process.env.NODE_ENV = "test";
    });

    it("should call jwt.sign with correct parameters", () => {
        generateAuthToken(mockUser, mockRes);

        expect(jwt.sign).toHaveBeenCalledWith(
            {
                user_id: mockUser.user_id,
                role: mockUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
    });

    it("should return the generated JWT token", () => {
        const result = generateAuthToken(mockUser, mockRes);

        expect(result).toBe(mockToken);
    });

    it("should set a cookie with correct parameters", () => {
        generateAuthToken(mockUser, mockRes);

        expect(mockRes.cookie).toHaveBeenCalledWith(
            "jwt",
            mockToken,
            expect.objectContaining({
                maxAge: 3600000,
                httpOnly: true,
                sameSite: "strict"
            })
        );
    });

    it("should set secure to false in development", () => {
        process.env.NODE_ENV = "development";

        generateAuthToken(mockUser, mockRes);

        expect(mockRes.cookie).toHaveBeenCalledWith(
            "jwt",
            mockToken,
            expect.objectContaining({
                secure: false
            })
        );
    });

    it("should set secure to true in production", () => {
        process.env.NODE_ENV = "production";

        generateAuthToken(mockUser, mockRes);

        expect(mockRes.cookie).toHaveBeenCalledWith(
            "jwt",
            mockToken,
            expect.objectContaining({
                secure: true
            })
        );
    });
});