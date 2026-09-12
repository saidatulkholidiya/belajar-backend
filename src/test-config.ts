import { config, isDev } from "./config/env.config";

console.log(`${config.app.name} berjalan di port ${config.app.port}`);
if (isDev) {
    console.log("Mode development — log detail aktif");
}