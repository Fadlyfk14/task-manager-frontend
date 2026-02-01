// js/insert.js
document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("form-insert");
const btnCancel = document.getElementById("btn-cancel");
btnCancel?.addEventListener("click", () => {
window.location.href = "index.html"; // atau index.html

});
form.addEventListener("submit", async (e) => {
e.preventDefault();
const npm = document.getElementById("npm").value.trim();
const nama = document.getElementById("nama").value.trim();
const prodi = document.getElementById("prodi").value.trim();
const alamat = document.getElementById("alamat").value.trim();
const hobiStr = document.getElementById("hobi").value.trim();
if (!npm || !nama) {
alert("NPM dan Nama wajib diisi!");
return;
}
const payload = {
npm,
nama,
prodi,
alamat,
hobi: parseHobi(hobiStr), // string[] dari koma
};
try {
const res = await fetch(API_MAHASISWA, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});
const json = await res.json();
if (!res.ok) {
alert(json?.message || "Gagal insert data");
return;
}
alert(json?.message || "Berhasil insert data");
window.location.href = "index.html"; // balik ke list
} catch (err) {
alert("Error koneksi ke server");
console.error(err);
}
});
});