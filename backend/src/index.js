import express from "express";
import path from "path";
import "dotenv/config";
import winston from "winston";
import app from "./app.js";

import { connectDB } from "./lib/db.js";
import { log } from "./setups/loggin.js";

const _dirname = path.resolve();

log();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(
            path.join(_dirname, "../frontend/dist", "index.html")
        );
    });
}

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    winston.info(`listening on port ${port} ...`);
    connectDB();
});