document.addEventListener("DOMContentLoaded", async () => {
  if (!requireAuth()) return;

  const tbody = document.getElementById("tbody-task");

  const totalEl = document.getElementById("total");
  const todoEl = document.getElementById("count-todo");
  const progressEl = document.getElementById("count-progress");
  const doneEl = document.getElementById("count-done");
  const soonEl = document.getElementById("count-soon");
  const overdueEl = document.getElementById("count-overdue");

  const searchInput = document.getElementById("searchTask");
  const filterStatus = document.getElementById("filterStatus");

  let allTasks = [];

  try {
    const res = await authFetch(API_TASK);
    if (!res.ok) throw new Error("Gagal ambil data");

    const json = await res.json();
    allTasks = json.data || [];

    render(allTasks);
    updateStats(allTasks);

  } catch (err) {
    console.error(err);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-6 text-red-500">
          Gagal mengambil data task
        </td>
      </tr>`;
  }

  /* ================= SEARCH & FILTER ================= */
  searchInput.addEventListener("input", applyFilter);
  filterStatus.addEventListener("change", applyFilter);

  function applyFilter() {
    const keyword = searchInput.value.toLowerCase();
    const status = filterStatus.value;

    const filtered = allTasks.filter(task => {
      const matchText =
        task.title.toLowerCase().includes(keyword) ||
        (task.description || "").toLowerCase().includes(keyword);

      const matchStatus = status ? task.status === status : true;

      return matchText && matchStatus;
    });

    render(filtered);
  }

  /* ================= RENDER TABLE ================= */
  function render(data) {
    if (!data.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-left py-6 text-gray-400">
            Tidak ada task
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = data.map((task, index) => {
      const today = new Date().setHours(0,0,0,0);
      const deadline = task.deadline
        ? new Date(task.deadline).setHours(0,0,0,0)
        : null;

      let deadlineClass = "";
      if (deadline && deadline < today && task.status !== "done") {
        deadlineClass = "text-red-600 font-semibold";
      } else if (deadline && deadline === today) {
        deadlineClass = "text-yellow-600 font-semibold";
      }

      return `
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-3 text-center">${index + 1}</td>
          <td class="px-4 py-3 font-medium text-left">${task.title}</td>
          <td class="px-4 py-3 text-left">${task.description || "-"}</td>
          <td class="px-4 py-3 text-center ${deadlineClass}">
            ${task.deadline || "-"}
          </td>

          <td class="px-4 py-3 text-left">
            <span class="px-3 py-1 rounded-full text-xs font-semibold
              ${task.status === "todo" ? "bg-gray-100 text-gray-700" : ""}
              ${task.status === "progress" ? "bg-blue-100 text-blue-700" : ""}
              ${task.status === "done" ? "bg-green-100 text-green-700" : ""}">
              ${
                task.status === "todo"
                  ? "Pending"
                  : task.status === "progress"
                  ? "Progress"
                  : "Done"
              }
            </span>
          </td>

          <td class="px-4 py-3 text-center">
            <button
              class="btn-edit bg-yellow-400 text-white px-2 py-1 rounded text-xs"
              data-id="${task.id}">
              Edit
            </button>
            <button
              class="btn-delete bg-red-500 text-white px-2 py-1 rounded text-xs ml-1"
              data-id="${task.id}">
              Hapus
            </button>
          </td>
        </tr>
      `;
    }).join("");

    bindActions();
  }

  /* ================= STATISTICS ================= */
  function updateStats(data) {
    const today = new Date().setHours(0,0,0,0);

    totalEl.textContent = data.length;
    todoEl.textContent = data.filter(t => t.status === "todo").length;
    progressEl.textContent = data.filter(t => t.status === "progress").length;
    doneEl.textContent = data.filter(t => t.status === "done").length;

    soonEl.textContent = data.filter(t =>
      t.deadline &&
      new Date(t.deadline).setHours(0,0,0,0) === today &&
      t.status !== "done"
    ).length;

    overdueEl.textContent = data.filter(t =>
      t.deadline &&
      new Date(t.deadline).setHours(0,0,0,0) < today &&
      t.status !== "done"
    ).length;
  }

  /* ================= BUTTON ACTION ================= */
  function bindActions() {
    document.querySelectorAll(".btn-edit").forEach(btn => {
      btn.onclick = () => {
        window.location.href = `update.html?id=${btn.dataset.id}`;
      };
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.onclick = async () => {
        if (!confirm("Yakin ingin menghapus task ini?")) return;

        try {
          const res = await authFetch(`${API_TASK}/${btn.dataset.id}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Gagal hapus");

          alert("Task berhasil dihapus");
          location.reload();
        } catch (err) {
          alert(err.message || "Gagal hapus task");
        }
      };
    });
  }
});

/* ================= LOGOUT ================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("btn-logout");
  if (!btnLogout) return;

  btnLogout.onclick = () => {
    if (!confirm("Yakin ingin logout?")) return;
    clearToken();
    window.location.href = "login.html";
  };
});
