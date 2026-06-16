// api.js - File Service Penanganan Fetch HTTP Request (CORS & JSON Bridge)
const ApiService = {
  // Mengambil Data Pengguna / User
  async getUsers() {
    const response = await fetch(CONFIG.API_URL + "?action=getUsers");
    const res = await response.json();
    return res.data || [];
  },

  // Izin Keluar Santri
  async getIzin() {
    const response = await fetch(CONFIG.API_URL + "?action=getIzin");
    const res = await response.json();
    return res.data || [];
  },

  async addIzin(data) {
    const req = await fetch(CONFIG.API_URL + "?action=addIzin", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return req;
  },

  async updateIzin(id, statusUp) {
    const req = await fetch(CONFIG.API_URL + "?action=updateIzin", {
      method: "POST",
      body: JSON.stringify({ id: id, status: statusUp })
    });
    return req;
  },

  async deleteIzin(id) {
    const req = await fetch(CONFIG.API_URL + "?action=deleteIzin&id=" + id, {
      method: "POST"
    });
    return req;
  },

  // Sarpras
  async getSarpras() {
    const response = await fetch(CONFIG.API_URL + "?action=getSarpras");
    const res = await response.json();
    return res.data || [];
  },

  async addSarpras(data) {
    const req = await fetch(CONFIG.API_URL + "?action=addSarpras", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return req;
  },

  async updateSarpras(id, statusUp) {
    const req = await fetch(CONFIG.API_URL + "?action=updateSarpras", {
      method: "POST",
      body: JSON.stringify({ id: id, status: statusUp })
    });
    return req;
  },

  // Pembelajaran
  async getPembelajaran() {
    const response = await fetch(CONFIG.API_URL + "?action=getPembelajaran");
    const res = await response.json();
    return res.data || [];
  },

  async addPembelajaran(data) {
    const req = await fetch(CONFIG.API_URL + "?action=addPembelajaran", {
      method: "POST",
      body: JSON.stringify(data)
    });
    return req;
  }
};
