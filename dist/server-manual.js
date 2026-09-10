"use strict";
// SOAL 1
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
let daftarPeserta = [
    { id: 1, nama: "Saidatul Kholidiya", sekolah: "SMK Negeri 6 Malang" },
    { id: 2, nama: "Ajeng Nielza", sekolah: "SMK Negeri 6 Malang" },
    { id: 3, nama: "Linda Angellina", sekolah: "SMK Negeri 5 Malang" },
    { id: 4, nama: "Dewi Sartika", sekolah: "SMK Negeri 5 Malang" }
];
const server = http_1.default.createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;
    // SOAL 1: GET /
    if (method === "GET" && path === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ pesan: "API Peserta Magang Batch 4" }));
        return;
    }
    // SOAL 1: GET /health
    if (method === "GET" && path === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            status: "ok",
            uptime: process.uptime()
        }));
        return;
    }
    // SOAL 2 & 3: GET /peserta
    if (method === "GET" && path === "/peserta") {
        const sekolah = url.searchParams.get("sekolah");
        let hasil = daftarPeserta;
        if (sekolah) {
            hasil = daftarPeserta.filter(p => p.sekolah.toLowerCase().includes(sekolah.toLowerCase()));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(hasil));
        return;
    }
    // SOAL 2: GET /peserta/:id
    if (method === "GET" && path.startsWith("/peserta/")) {
        const id = Number(path.split("/")[2]);
        const peserta = daftarPeserta.find(p => p.id === id);
        if (!peserta) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Peserta tidak ditemukan" }));
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(peserta));
        return;
    }
    // SOAL 4: POST /peserta
    if (method === "POST" && path === "/peserta") {
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                if (!data.nama || data.nama.trim() === "") {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Nama tidak boleh kosong" }));
                    return;
                }
                const idBaru = daftarPeserta.length > 0
                    ? Math.max(...daftarPeserta.map(p => p.id)) + 1
                    : 1;
                const pesertaBaru = {
                    id: idBaru,
                    nama: data.nama,
                    sekolah: data.sekolah || "-"
                };
                daftarPeserta.push(pesertaBaru);
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ sukses: true, data: pesertaBaru }));
            }
            catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "JSON tidak valid" }));
            }
        });
        return;
    }
    // SOAL 5: DELETE /peserta/:id
    if (method === "DELETE" && path.startsWith("/peserta/")) {
        const id = Number(path.split("/")[2]);
        const index = daftarPeserta.findIndex(p => p.id === id);
        if (index === -1) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Peserta tidak ditemukan" }));
            return;
        }
        daftarPeserta.splice(index, 1);
        res.writeHead(204);
        res.end();
        return;
    }
    // 404 default
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route tidak ditemukan" }));
});
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
//# sourceMappingURL=server-manual.js.map