import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

import auth from "../routes/auth.js"
import categories from "../routes/categories.js"
import { error } from "../middleware/error.js";

export default function setupRoutes(app) {
    app.use(express.json({limit: '5mb'}));
    app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    }));
    app.use(cookieParser());
    app.use('/api/auth', auth);
    app.use('/api/categories', categories)
    app.use(error)
}