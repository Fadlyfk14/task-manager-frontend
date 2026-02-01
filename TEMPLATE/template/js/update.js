document.addEventListener("DOMContentLoaded", async () => {
const form = document.getElementById("form-insert"); // kalau id form kamu sama
const btnCancel = document.getElementById("btn-cancel");
const params = new URLSearchParams(window.location.search);
const npmParam = params.get("npm");
if (!npmParam) {
alert("NPM tidak ditemukan di URL. Contoh: update.html?npm=1224001");
window.location.href = "index.html";
return;
}
btnCancel?.addEventListener("click", () => {
window.location.href = "index.html";
});
// 1) Load detail
try {
const res = await fetch(`${API_MAHASISWA}/${npmParam}`);
const json = await res.json();
if (!res.ok) {
alert(json?.message || "Gagal ambil detail mahasiswa");
return;
}
const mhs = json.data;
document.getElementById("npm").value = mhs.npm || npmParam;
document.getElementById("nama").value = mhs.nama || "";
document.getElementById("prodi").value = mhs.prodi || "";
document.getElementById("alamat").value = mhs.alamat || "";
document.getElementById("hobi").value = Array.isArray(mhs.hobi) ?
mhs.hobi.join(",") : (mhs.hobi || "");
} catch (err) {
alert("Error koneksi ke server saat ambil detail");
console.error(err);
return;
}
// 2) Submit update
form.addEventListener("submit", async (e) => {
e.preventDefault();
const npm = document.getElementById("npm").value.trim();
const nama = document.getElementById("nama").value.trim();
const prodi = document.getElementById("prodi").value.trim();
const alamat = document.getElementById("alamat").value.trim();
const hobiStr = document.getElementById("hobi").value.trim();
const payload = { npm, nama, prodi, alamat, hobi: parseHobi(hobiStr) };
try {
const res = await fetch(`${API_MAHASISWA}/${npm}`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});
const json = await res.json();
if (!res.ok) {
alert(json?.message || "Gagal update data");
return;
}
alert(json?.message || "Berhasil update data");
window.location.href = "index.html";
} catch (err) {
alert("Error koneksi ke server saat update");
console.error(err);
}
});
});