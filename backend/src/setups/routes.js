import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

import auth from "../routes/auth.js"
import categories from "../routes/categories.js"
import products from "../routes/products.js"
import { error } from "../middleware/error.js";

export default function setupRoutes(app) {
    app.use(express.json({limit: '5mb'}));
    app.use(cors());
    app.use(cookieParser());
    app.use('/api/auth', auth);
    app.use('/api/categories', categories)
    app.use('/api/products', products)
    app.use(error)
}