"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const os_1 = __importDefault(require("os"));
// SOAL 1
function analisisPath(filePath) {
    console.log("Nama file    :", path_1.default.basename(filePath));
    console.log("Ekstensi     :", path_1.default.extname(filePath));
    console.log("Folder induk :", path_1.default.dirname(filePath));
    console.log("Path absolut :", path_1.default.resolve(filePath));
}
// SOAL 2
async function simpanLog(pesan) {
    const sekarang = new Date();
    const waktu = `[${sekarang.getFullYear()}-${String(sekarang.getMonth() + 1).padStart(2, "0")}-${String(sekarang.getDate()).padStart(2, "0")} ${String(sekarang.getHours()).padStart(2, "0")}:${String(sekarang.getMinutes()).padStart(2, "0")}:${String(sekarang.getSeconds()).padStart(2, "0")}]`;
    const folderLogs = path_1.default.join(__dirname, "..", "logs");
    const fileLog = path_1.default.join(folderLogs, "app.log");
    await promises_1.default.mkdir(folderLogs, { recursive: true });
    await promises_1.default.appendFile(fileLog, `${waktu} ${pesan}\n`, "utf-8");
}
// SOAL 3
async function daftarFile(folder) {
    const files = await promises_1.default.readdir(folder);
    for (const file of files) {
        const fullPath = path_1.default.join(folder, file);
        const stat = await promises_1.default.stat(fullPath);
        if (stat.isFile()) {
            const ukuran = (stat.size / 1024).toFixed(2);
            console.log(`${file.padEnd(20)} ${ukuran} KB`);
        }
    }
}
async function bacaJSON(filePath) {
    const isi = await promises_1.default.readFile(filePath, "utf-8");
    return JSON.parse(isi);
}
async function tulisJSON(filePath, data) {
    await promises_1.default.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
// SOAL 5
function laporanSistem() {
    return `
Platform      : ${os_1.default.platform()}
CPU Core      : ${os_1.default.cpus().length} core
Total RAM     : ${(os_1.default.totalmem() / 1024 ** 3).toFixed(2)} GB
Free RAM      : ${(os_1.default.freemem() / 1024 ** 3).toFixed(2)} GB
Home Dir      : ${os_1.default.homedir()}
Hostname      : ${os_1.default.hostname()}
Uptime        : ${(os_1.default.uptime() / 3600).toFixed(1)} jam
`;
}
// TEST SEMUA 
async function test() {
    console.log("SOAL 1");
    analisisPath("./src/index.ts");
    console.log("\nSOAL 2");
    await simpanLog("Aplikasi mulai");
    console.log("Log tersimpan");
    console.log("\nSOAL 3");
    await daftarFile("./src");
    console.log("\nSOAL 4");
    const tasks = [
        { id: 1, judul: "Belajar Node.js", selesai: false },
        { id: 2, judul: "Setup environment", selesai: true },
        { id: 3, judul: "Kerjakan latihan", selesai: false }
    ];
    await promises_1.default.mkdir("./data", { recursive: true });
    await tulisJSON("./data/tasks.json", tasks);
    const hasil = await bacaJSON("./data/tasks.json");
    console.log(hasil);
    console.log("\nSOAL 5");
    console.log(laporanSistem());
}
test();
//# sourceMappingURL=file-manager.js.map