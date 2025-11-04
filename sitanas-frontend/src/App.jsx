// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/layout/Layout'; // 1. Impor Layout
import ProtectedRoute from './components/common/ProtectedRoute'; // 2. Impor Penjaga

// Buat halaman dummy lainnya untuk tes link
const LaporanPage = () => <h2>Halaman Laporan (WIP)</h2>;
const ManajemenPenggunaPage = () => <h2>Halaman Manajemen Pengguna (WIP)</h2>;
const LogsPage = () => <h2>Halaman Log Aktivitas (WIP)</h2>;

function App() {
  return (
    <Routes>
      {/* Rute Publik: Halaman Login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />

      {/* Grup Rute Terlindungi (Protected Routes) 
        Semua rute di dalam sini akan:
        1. Dilindungi oleh <ProtectedRoute>
        2. Ditampilkan di dalam <Layout> (Sidebar + Topbar)
      */}
      <Route
        path="/" // Ini adalah "induk" untuk rute di dalamnya
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Rute di bawah ini adalah 'children' dari Layout */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="laporan" element={<LaporanPage />} />
        <Route path="manajemen-pengguna" element={<ManajemenPenggunaPage />} />
        <Route path="logs" element={<LogsPage />} />
        
        {/* Nanti kita akan tambahkan rute lain seperti /tanah/detail/:id */}
      </Route>

      {/* Rute 404 (Halaman Tidak Ditemukan) */}
      <Route path="*" element={<h2>404: Halaman Tidak Ditemukan</h2>} />
    </Routes>
  );
}

export default App;