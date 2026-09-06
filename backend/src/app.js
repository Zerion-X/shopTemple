import express from "express";
import setupRoutes from "./setups/routes.js";

const app = express();

setupRoutes(app);

export default app;