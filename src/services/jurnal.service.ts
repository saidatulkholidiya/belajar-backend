import fs from "fs/promises";
import path from "path";
import { Jurnal } from "../types/jurnal.types";

const FILE_PATH = path.join(__dirname, "..", "data", "jurnal.json");

// Baca semua jurnal
export async function bacaSemuaJurnal(): Promise<Jurnal[]> {
    try {
        const isi = await fs.readFile(FILE_PATH, "utf-8");
        return JSON.parse(isi) as Jurnal[];
    } catch {
        // Kalo file belum ada, balikin array kosong
        return [];
    }
}

// Tulis semua jurnal
export async function tulisSemuaJurnal(data: Jurnal[]): Promise<void> {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Cari berdasarkan ID
export async function cariJurnalById(id: number): Promise<Jurnal | undefined> {
    const semua = await bacaSemuaJurnal();
    return semua.find(j => j.id === id);
}