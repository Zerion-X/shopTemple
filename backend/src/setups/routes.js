import express from "express"
import cors from "cors"

import auth from "../routes/auth.js"

export default function setupRoutes(app) {
    app.use(express.json({limit: '5mb'}));
    app.use(cors());
    app.use('/api/auth', auth);
}