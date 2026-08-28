import jwt from 'jsonwebtoken';
import config from "config";


function generateAuthToken(userId, role) {
    const token = jwt.sign(
        {
            userId: userId,
            role: role
        },
        config.get("jwtPrivateKey"),
        { expiresIn: "1h" }
    );
    return token;
}

export { generateAuthToken };