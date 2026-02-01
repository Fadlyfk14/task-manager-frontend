// Alamat dasar backend
const API_BASE = "http://127.0.0.1:3000/api";

// Endpoint mahasiswa
const API_MAHASISWA = `${API_BASE}/mahasiswa`;

// Helper untuk parsing hobi
function parseHobi(input) {
  if (!input) return [];
  return input
    .split(",")
    .map(x => x.trim())
    .filter(x => x.length > 0);
}
