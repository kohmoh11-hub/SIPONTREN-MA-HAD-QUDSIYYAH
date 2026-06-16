// app.js - Vanilla JS untuk login session, routing, dan integrasi Bootstrap 5
document.addEventListener("DOMContentLoaded", () => {
  // Ambil state session dari LocalStorage
  const sessionUser = JSON.parse(localStorage.getItem("active_session"));
  
  // Jika tidak login, alihkan ke login.html (kecuali jika di halaman login itu sendiri)
  if (!sessionUser && window.location.pathname.indexOf("login.html") === -1) {
    window.location.href = "login.html";
    return;
  }
  
  if (sessionUser) {
    // Tampilkan data profil di navbar samping
    const userNameEl = document.getElementById("nav-user-name");
    const userRoleEl = document.getElementById("nav-user-role");
    
    if (userNameEl) userNameEl.innerText = sessionUser.nama;
    if (userRoleEl) userRoleEl.innerText = sessionUser.role;
    
    // Kelola akses visibilitas menu sesuai peran (Role-Based Access Control)
    renderAccessControl(sessionUser.role);
    
    // Deteksi jika ada kontainer render grafik ChartJS di halaman dasbor
    if (document.getElementById("dashboardChart")) {
      initDashboardCharts();
    }
  }
});

// Role-Based Access Control
function renderAccessControl(role) {
  const allNavs = {
    Admin: ["nav-dashboard", "nav-izin", "nav-sarpras", "nav-pembelajaran", "nav-users"],
    Pengasuh: ["nav-dashboard", "nav-izin"],
    Guru: ["nav-pembelajaran"],
    "Petugas Sarpras": ["nav-dashboard", "nav-sarpras"],
    Santri: ["nav-dashboard", "nav-izin", "nav-sarpras"]
  };

  const allowedNavs = allNavs[role] || ["nav-dashboard"];
  const navItems = ["nav-dashboard", "nav-izin", "nav-sarpras", "nav-pembelajaran", "nav-users"];

  navItems.forEach(item => {
    const el = document.getElementById(item);
    if (el) {
      if (allowedNavs.includes(item)) {
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    }
  });
}

// Simulasi in-app logout
function handleLogout() {
  localStorage.removeItem("active_session");
  window.location.href = "login.html";
}

// Inisialisasi Grafik Chart.js untuk Pondok Pesantren
function initDashboardCharts() {
  const ctxIzin = document.getElementById('dashboardChart').getContext('2d');
  
  new Chart(ctxIzin, {
    type: 'line',
    data: {
      labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'],
      datasets: [{
        label: 'Frekuensi Keluar Santri',
        data: [12, 19, 3, 5, 2, 3, 22],
        borderColor: '#0f766e',
        backgroundColor: 'rgba(15, 118, 110, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
