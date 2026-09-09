// SOAL 1
function tunggu(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function hitungMundur(dari: number): Promise<void> {
    for (let i = dari; i >= 1; i--) {
        console.log(i);
        await tunggu(1000);
    }
    console.log("Selesai!");
}

// SOAL 2
interface Peserta {
    id: number;
    nama: string;
}

const dataDummy: Peserta[] = [
    { id: 1, nama: "Budi" },
    { id: 2, nama: "Ani" },
    { id: 3, nama: "Caca" }
];

function simulasiAmbilPeserta(id: number): Promise<Peserta> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const cari = dataDummy.find(p => p.id === id);
            if (cari) {
                resolve(cari);
            } else {
                reject(new Error(`Peserta dengan ID ${id} tidak ditemukan`));
            }
        }, 500);
    });
}

// SOAL 5 (didefinisikan sebelum dipakai di Soal 3 & 4)
type Hasil<T> =
    | { sukses: true; data: T }
    | { sukses: false; error: string };

async function amanKan<T>(promise: Promise<T>): Promise<Hasil<T>> {
    try {
        const data = await promise;
        return { sukses: true, data };
    } catch (err) {
        return { sukses: false, error: (err as Error).message };
    }
}

// SOAL 3
// Setiap pemanggilan simulasiAmbilPeserta dibungkus dengan amanKan,
// agar id yang gagal tidak menghentikan proses (hasil gagal cukup dilewati / dicatat)
async function ambilSemuaSequential(ids: number[]): Promise<Peserta[]> {
    const hasil: Peserta[] = [];
    for (const id of ids) {
        const r = await amanKan(simulasiAmbilPeserta(id));
        if (r.sukses) {
            hasil.push(r.data);
        } else {
            console.log(`- ID ${id} gagal diambil: ${r.error}`);
        }
    }
    return hasil;
}

async function ambilSemuaParallel(ids: number[]): Promise<Peserta[]> {
    const hasilSemua = await Promise.all(ids.map(id => amanKan(simulasiAmbilPeserta(id))));
    const hasil: Peserta[] = [];
    hasilSemua.forEach((r, index) => {
        if (r.sukses) {
            hasil.push(r.data);
        } else {
            console.log(`- ID ${ids[index]} gagal diambil: ${r.error}`);
        }
    });
    return hasil;
}

// SOAL 4
async function ambilDenganToleransi(ids: number[]): Promise<void> {
    const hasil = await Promise.all(ids.map(id => amanKan(simulasiAmbilPeserta(id))));
    console.log("Hasil yang berhasil:");
    hasil.forEach((r, index) => {
        if (r.sukses) {
            console.log(`- ID ${ids[index]}: ${r.data.nama}`);
        } else {
            console.log(`- ID ${ids[index]}: GAGAL - ${r.error}`);
        }
    });
}

// TEST SEMUA
async function main() {
    console.log("=== SOAL 1 ===");
    await hitungMundur(3);

    console.log("\n=== SOAL 2 ===");
    const hasil2 = await amanKan(simulasiAmbilPeserta(2));
    if (hasil2.sukses) {
        console.log(hasil2.data);
    } else {
        console.error(hasil2.error);
    }

    console.log("\n=== SOAL 3 ===");
    const ids = [1, 2, 3];
    console.time("Sequential");
    await ambilSemuaSequential(ids);
    console.timeEnd("Sequential");

    console.time("Parallel");
    await ambilSemuaParallel(ids);
    console.timeEnd("Parallel");

    console.log("\n=== SOAL 4 ===");
    await ambilDenganToleransi([1, 2, 999, 3]);

    console.log("\n=== SOAL 5 ===");
    const hasil1 = await amanKan(simulasiAmbilPeserta(1));
    if (hasil1.sukses) {
        console.log("Berhasil:", hasil1.data);
    } else {
        console.log("Gagal:", hasil1.error);
    }
}

main();