import express from "express"
import path from "path"
import "dotenv/config"

const app = express();
const _dirname = path.resolve();
import {connectDB} from './lib/db.js'

import setupRoutes from "./setups/routes.js";
setupRoutes(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(_dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(_dirname, '../frontend/dist', 'index.html'));
    }) ;
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`listenning on port ${port} ...`);
    connectDB();
});
