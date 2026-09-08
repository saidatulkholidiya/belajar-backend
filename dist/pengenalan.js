"use strict";
function infoSistem() {
    console.log("Versi Node.js :", process.version);
    console.log("Platform OS   :", process.platform);
    console.log("Direktori kerja:", process.cwd());
    console.log("Uptime proses :", process.uptime(), "detik");
}
const args = process.argv.slice(2);
console.log("Argumen diterima:", args.join(", "));
setTimeout(() => {
    console.log("Keempat (setelah 1 detik)");
}, 1000);
setTimeout(() => {
    console.log("Ketiga (setelah 500ms)");
}, 500);
console.log("Pertama");
console.log("Kedua");
infoSistem();
//# sourceMappingURL=pengenalan.js.map