document.addEventListener("DOMContentLoaded", async () => {
  console.log("EDIT JS LOADED");

  if (!requireAuth()) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("ID task tidak ditemukan");
    window.location.href = "index.html";
    return;
  }

  const form = document.getElementById("form-edit");
  const btnCancel = document.getElementById("btn-cancel");

  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const deadline = document.getElementById("deadline");
  const status = document.getElementById("status");

  /* ================= GET DATA ================= */
  try {
    const res = await authFetch(`${API_TASK}/${id}`);
    if (!res.ok) throw new Error("Fetch gagal");

    const json = await res.json();
    const task = json.data;

    if (!task) throw new Error("Data task kosong");

    title.value = task.title;
    description.value = task.description || "";
    status.value = task.status;

    if (task.deadline) {
      deadline.value = task.deadline.split("T")[0];
    }

  } catch (err) {
    console.error(err);
    alert("Gagal mengambil data task");
    window.location.href = "index.html";
  }

  /* ================= SUBMIT ================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const res = await authFetch(`${API_TASK}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.value,
          description: description.value,
          deadline: deadline.value,
          status: status.value,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      alert("✅ Task berhasil diupdate");
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      alert("❌ Gagal update task");
    }
  });

  /* ================= CANCEL ================= */
  btnCancel.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
