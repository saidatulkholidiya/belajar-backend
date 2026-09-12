//console.log("Server siap!");
//console.log("Node version:", process.version);
//console.log("Folder:", __dirname);

import http from "http";
import { router } from "./server/router";
import { config } from "./config/env.config";

const server = http.createServer(async (req, res) => {
    try {
        await router(req, res);
    } catch (err) {
        console.error("Error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
});

const PORT = config.app.port;
server.listen(PORT, () => {
    console.log(`${config.app.name} berjalan di http://localhost:${PORT}`);
});
