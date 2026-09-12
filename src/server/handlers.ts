import { IncomingMessage, ServerResponse } from "http";
import { bacaSemuaJurnal, tulisSemuaJurnal, cariJurnalById } from "../services/jurnal.service";
import { Jurnal } from "../types/jurnal.types";

// Helper: kirim JSON response
function kirimJSON(res: ServerResponse, status: number, data: any): void {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

// Helper: baca body request
function bacaBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error("JSON tidak valid"));
            }
        });
    });
}

// GET /health
export function handleHealth(res: ServerResponse): void {
    kirimJSON(res, 200, {
        status: "ok",
        uptime: process.uptime()
    });
}

// GET /jurnal
export async function handleGetJurnal(res: ServerResponse, pesertaId?: number): Promise<void> {
    try {
        let semua = await bacaSemuaJurnal();
        if (pesertaId) {
            semua = semua.filter(j => j.pesertaId === pesertaId);
        }
        kirimJSON(res, 200, semua);
    } catch (err) {
        kirimJSON(res, 500, { error: "Gagal membaca data" });
    }
}

// GET /jurnal/:id
export async function handleGetJurnalById(res: ServerResponse, id: number): Promise<void> {
    try {
        const jurnal = await cariJurnalById(id);
        if (!jurnal) {
            kirimJSON(res, 404, { error: "Jurnal tidak ditemukan" });
            return;
        }
        kirimJSON(res, 200, jurnal);
    } catch {
        kirimJSON(res, 500, { error: "Gagal membaca data" });
    }
}

// POST /jurnal
export async function handlePostJurnal(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const data = await bacaBody(req);

        // Validasi
        if (!data.kegiatan || data.kegiatan.trim().length < 10) {
            kirimJSON(res, 400, { error: "Kegiatan minimal 10 karakter" });
            return;
        }
        if (!data.pesertaId) {
            kirimJSON(res, 400, { error: "pesertaId wajib diisi" });
            return;
        }

        const semua = await bacaSemuaJurnal();
        const idBaru = semua.length > 0 ? Math.max(...semua.map(j => j.id)) + 1 : 1;

        const jurnalBaru: Jurnal = {
            id: idBaru,
            pesertaId: data.pesertaId,
            kegiatan: data.kegiatan,
            tanggal: new Date().toISOString()
        };

        semua.push(jurnalBaru);
        await tulisSemuaJurnal(semua);

        kirimJSON(res, 201, { sukses: true, data: jurnalBaru });
    } catch (err) {
        kirimJSON(res, 400, { error: (err as Error).message });
    }
}

// PUT /jurnal/:id
export async function handlePutJurnal(req: IncomingMessage, res: ServerResponse, id: number): Promise<void> {
    try {
        const data = await bacaBody(req);

        if (data.kegiatan && data.kegiatan.trim().length < 10) {
            kirimJSON(res, 400, { error: "Kegiatan minimal 10 karakter" });
            return;
        }

        const semua = await bacaSemuaJurnal();
        const index = semua.findIndex(j => j.id === id);

        if (index === -1) {
            kirimJSON(res, 404, { error: "Jurnal tidak ditemukan" });
            return;
        }

        semua[index] = {
            ...semua[index],
            kegiatan: data.kegiatan ?? semua[index].kegiatan,
            pesertaId: data.pesertaId ?? semua[index].pesertaId
        };

        await tulisSemuaJurnal(semua);
        kirimJSON(res, 200, { sukses: true, data: semua[index] });
    } catch (err) {
        kirimJSON(res, 400, { error: (err as Error).message });
    }
}

// DELETE /jurnal/:id
export async function handleDeleteJurnal(res: ServerResponse, id: number): Promise<void> {
    try {
        const semua = await bacaSemuaJurnal();
        const index = semua.findIndex(j => j.id === id);

        if (index === -1) {
            kirimJSON(res, 404, { error: "Jurnal tidak ditemukan" });
            return;
        }

        semua.splice(index, 1);
        await tulisSemuaJurnal(semua);
        res.writeHead(204);
        res.end();
    } catch {
        kirimJSON(res, 500, { error: "Gagal menghapus data" });
    }
}