import { IncomingMessage, ServerResponse } from "http";
import {
    handleHealth,
    handleGetJurnal,
    handleGetJurnalById,
    handlePostJurnal,
    handlePutJurnal,
    handleDeleteJurnal
} from "./handlers";

export async function router(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;

    // GET /health
    if (method === "GET" && path === "/health") {
        handleHealth(res);
        return;
    }

    // GET /jurnal (dengan filter opsional)
    if (method === "GET" && path === "/jurnal") {
        const peserta = url.searchParams.get("peserta");
        const pesertaId = peserta ? Number(peserta) : undefined;
        await handleGetJurnal(res, pesertaId);
        return;
    }

    // GET /jurnal/:id
    if (method === "GET" && path.startsWith("/jurnal/")) {
        const id = Number(path.split("/")[2]);
        await handleGetJurnalById(res, id);
        return;
    }

    // POST /jurnal
    if (method === "POST" && path === "/jurnal") {
        await handlePostJurnal(req, res);
        return;
    }

    // PUT /jurnal/:id
    if (method === "PUT" && path.startsWith("/jurnal/")) {
        const id = Number(path.split("/")[2]);
        await handlePutJurnal(req, res, id);
        return;
    }

    // DELETE /jurnal/:id
    if (method === "DELETE" && path.startsWith("/jurnal/")) {
        const id = Number(path.split("/")[2]);
        await handleDeleteJurnal(res, id);
        return;
    }

    // 404 default
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route tidak ditemukan" }));
}