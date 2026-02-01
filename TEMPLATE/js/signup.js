document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-signup");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signup-username").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!username || !password) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      const res = await fetch(API_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Signup gagal");
        return;
      }

      alert("Akun berhasil dibuat, silakan login");
      document.querySelector(".form-inner").style.marginLeft = "0%";

    } catch (err) {
      alert("Gagal konek ke server");
    }
  });
});
