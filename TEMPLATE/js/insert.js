document.addEventListener("DOMContentLoaded", () => {
  console.log("INSERT JS LOADED");

  if (!requireAuth()) return;

  const form = document.getElementById("form-insert");
  const btnCancel = document.getElementById("btn-cancel");

  if (!form) {
    alert("FORM INSERT TIDAK DITEMUKAN");
    return;
  }

  btnCancel.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("SUBMIT DIKLIK");

    const payload = {
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
      deadline: document.getElementById("deadline").value,
      status: document.getElementById("status").value
    };

    if (!payload.title) {
      alert("Title wajib diisi");
      return;
    }

    try {
      const res = await authFetch(API_TASK, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Gagal insert task");
        return;
      }

      alert("Task berhasil ditambahkan");
      window.location.href = "index.html";

    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  });
});
