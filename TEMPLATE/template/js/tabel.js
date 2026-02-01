//const URL_API_MAHASISWA = "http://127.0.0.1:3000/api/mahasiswa";

document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("tbody-mahasiswa");
    const jumlahMhs = document.getElementById("jumlah-mahasiswa");

    fetch(API_MAHASISWA)
        .then((response) => response.json())
        .then((hasil) => {
            const data = Array.isArray(hasil.data) ? hasil.data : [];
            let rows = "";

            // Tampilkan jumlah mahasiswa
            if (jumlahMhs) {
                jumlahMhs.textContent = data.length;
            }

            // Jika tidak ada data
            if (data.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center py-4">
                            Tidak ada data mahasiswa
                        </td>
                    </tr>
                `;
                return;
            }

            // Loop data mahasiswa
            data.forEach((mhs) => {
                const hobi = Array.isArray(mhs.hobi)
                    ? mhs.hobi.join(", ")
                    : (mhs.hobi || "-");

                rows += `
                    <tr class="h-18 border-b border-coolGray-100">
                        <td class="px-4 bg-white text-sm font-medium">${mhs.npm || "-"}</td>
                        <td class="px-4 bg-white text-sm font-medium">${mhs.nama || "-"}</td>
                        <td class="px-4 bg-white text-sm">${mhs.prodi || "-"}</td>
                        <td class="px-4 bg-white text-sm">${mhs.alamat || "-"}</td>
                        <td class="px-4 bg-white text-sm">${hobi}</td>
                        <td class="px-4 bg-white text-sm">
                        <button
                        class="btn-edit bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                        data-npm="${mhs.npm}">
                        Edit
                        </button>
                        <button
                        class="btn-delete bg-red-500 text-white px-2 py-1 rounded text-xs ml-1"
                        data-npm="${mhs.npm}">
                        Hapus
                        </button>
                        </td>
                    </tr>
                `;
            });

            if (tbody) tbody.innerHTML = rows;

            document.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", async () => {

            const npm = btn.dataset.npm;
            if (!confirm(`Yakin hapus mahasiswa NPM ${npm}?`)) return;
            try {
            const res = await fetch(`${API_MAHASISWA}/${npm}`, { method: "DELETE" });
            const json = await res.json();
            if (!res.ok) {
            alert(json?.message || "Gagal hapus data");
            return;
            }
            alert(json?.message || "Berhasil hapus data");
            // refresh tabel: cara paling gampang reload
            window.location.reload();
            } catch (err) {
            alert("Error koneksi ke server saat delete");
            console.error(err);
            }
            });
            });
            document.querySelectorAll(".btn-edit").forEach((btn) => {
            btn.addEventListener("click", () => {
            const npm = btn.dataset.npm;
            window.location.href = `update.html?npm=${encodeURIComponent(npm)}`;
            });
            });
        })
        .catch(() => {
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center text-red-500 py-4">
                            Gagal mengambil data mahasiswa
                        </td>
                    </tr>
                `;
            }
        });
       
});
