import aj from '../lib/arcjet.js';
import {isSpoofedBot} from "@arcjet/inspect";

export default async function (req, res, next) {
    try {
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).send("Rate limit exceeded");
            }
            else if (decision.reason.isBot()) {
                return res.status(403).send("Bot detected");
            }
            else {
                return res.status(403).send("Access denied by Arcjet");
            }
        }
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).send("Spoofed bot detected");
        }
        next();
    } catch (error) {
        console.error("Error in Arcjet middleware:", error.message);
        next();
    }
}