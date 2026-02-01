document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");

  if (!form) {
    console.error("Form login tidak ditemukan");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
      alert("Username dan password wajib diisi");
      return;
    }

    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();
      console.log("LOGIN RESPONSE:", json);

      if (!res.ok) {
        alert(json.message || "Login gagal");
        return;
      }

      const token = json.token || json.data?.token;
      if (!token) {
        alert("Token tidak ditemukan");
        return;
      }

      setToken(token);
      alert("Login berhasil");
      window.location.href = "index.html";

    } catch (err) {
      console.error(err);
      alert("Gagal konek ke server");
    }
  });
});
