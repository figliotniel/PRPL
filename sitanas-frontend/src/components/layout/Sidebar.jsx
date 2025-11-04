import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../assets/Layout.css';

// Nanti kita akan terima 'user' dan 'onLogout' via props
const Sidebar = ({ onLogout }) => {
  // Nanti kita akan tambahkan logic role-based di sini
  const isAdmin = true; // Ganti ini dengan user.role_id === 1

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <i className="fas fa-landmark sidebar-logo"></i>
        <h2 className="sidebar-title">SITANAS</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard">
              <i className="fas fa-tachometer-alt fa-fw"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/laporan">
              <i className="fas fa-file-alt fa-fw"></i> Laporan
            </NavLink>
          </li>
          
          {/* Tampilkan link ini HANYA jika Admin */}
          {isAdmin && (
            <li>
              <NavLink to="/manajemen-pengguna">
                <i className="fas fa-users-cog fa-fw"></i> Manajemen Pengguna
              </NavLink>
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink to="/logs">
                <i className="fas fa-history fa-fw"></i> Log Aktivitas
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={onLogout} className="btn-danger">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;