import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

import auth from "../routes/auth.js"
import { error } from "../middleware/error.js";

export default function setupRoutes(app) {
    app.use(express.json({limit: '5mb'}));
    app.use(cors());
    app.use(cookieParser());
    app.use('/api/auth', auth);
    app.use(error)
}