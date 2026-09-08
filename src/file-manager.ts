import path from "path";
import fs from "fs/promises";
import os from "os";

// SOAL 1
function analisisPath(filePath: string): void {
    console.log("Nama file    :", path.basename(filePath));
    console.log("Ekstensi     :", path.extname(filePath));
    console.log("Folder induk :", path.dirname(filePath));
    console.log("Path absolut :", path.resolve(filePath));
}

// SOAL 2
async function simpanLog(pesan: string): Promise<void> {
    const sekarang = new Date();
    const waktu = `[${sekarang.getFullYear()}-${String(sekarang.getMonth() + 1).padStart(2, "0")}-${String(sekarang.getDate()).padStart(2, "0")} ${String(sekarang.getHours()).padStart(2, "0")}:${String(sekarang.getMinutes()).padStart(2, "0")}:${String(sekarang.getSeconds()).padStart(2, "0")}]`;
    
    const folderLogs = path.join(__dirname, "..", "logs");
    const fileLog = path.join(folderLogs, "app.log");
    
    await fs.mkdir(folderLogs, { recursive: true });
    await fs.appendFile(fileLog, `${waktu} ${pesan}\n`, "utf-8");
}

// SOAL 3
async function daftarFile(folder: string): Promise<void> {
    const files = await fs.readdir(folder);
    for (const file of files) {
        const fullPath = path.join(folder, file);
        const stat = await fs.stat(fullPath);
        if (stat.isFile()) {
            const ukuran = (stat.size / 1024).toFixed(2);
            console.log(`${file.padEnd(20)} ${ukuran} KB`);
        }
    }
}

// SOAL 4
interface Task {
    id: number;
    judul: string;
    selesai: boolean;
}

async function bacaJSON<T>(filePath: string): Promise<T> {
    const isi = await fs.readFile(filePath, "utf-8");
    return JSON.parse(isi) as T;
}

async function tulisJSON<T>(filePath: string, data: T): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// SOAL 5
function laporanSistem(): string {
    return `
Platform      : ${os.platform()}
CPU Core      : ${os.cpus().length} core
Total RAM     : ${(os.totalmem() / 1024 ** 3).toFixed(2)} GB
Free RAM      : ${(os.freemem() / 1024 ** 3).toFixed(2)} GB
Home Dir      : ${os.homedir()}
Hostname      : ${os.hostname()}
Uptime        : ${(os.uptime() / 3600).toFixed(1)} jam
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
    const tasks: Task[] = [
        { id: 1, judul: "Belajar Node.js", selesai: false },
        { id: 2, judul: "Setup environment", selesai: true },
        { id: 3, judul: "Kerjakan latihan", selesai: false }
    ];
    await fs.mkdir("./data", { recursive: true });
    await tulisJSON("./data/tasks.json", tasks);
    const hasil = await bacaJSON<Task[]>("./data/tasks.json");
    console.log(hasil);
    
    console.log("\nSOAL 5");
    console.log(laporanSistem());
}

test();