import React, { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser, getRoles } from '../services/userService';
import { generateStrongPassword } from '../utils/passwordGenerator';
import { useAuth } from '../hooks/useAuth';
import '../../assets/Layout.css'; 

// Component Modal akan kita buat di langkah berikutnya, untuk sementara pakai div
const DummyModal = ({ children, onClose }) => (
    <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
        <div className="card" style={{ width: '400px', padding: '20px' }}>
            <div className="card-header">
                <h4>Tambah Pengguna</h4>
                <button className="btn btn-danger btn-sm" onClick={onClose}>X</button>
            </div>
            <div className="card-body">{children}</div>
        </div>
    </div>
);


function ManajemenPenggunaPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ 
        nama_lengkap: '', 
        email: '', 
        password: '', 
        password_confirmation: '', 
        role_id: '' 
    });
    const [formError, setFormError] = useState(null);

    // Fetch data utama
    const fetchUsersAndRoles = async () => {
        if (user?.role_id !== 1) return; // Hanya Admin
        try {
            setLoading(true);
            const [usersResponse, rolesResponse] = await Promise.all([
                getUsers(),
                getRoles()
            ]);
            setUsers(usersResponse);
            setRoles(rolesResponse);
        } catch (err) {
            setError("Gagal memuat data pengguna.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersAndRoles();
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGeneratePassword = () => {
        const newPass = generateStrongPassword();
        setForm({ ...form, password: newPass, password_confirmation: newPass });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await createUser(form);
            alert("Pengguna berhasil ditambahkan!");
            setShowModal(false);
            setForm({ nama_lengkap: '', email: '', password: '', password_confirmation: '', role_id: '' });
            fetchUsersAndRoles(); // Refresh data
        } catch (err) {
            setFormError(err.response?.data?.message || "Gagal membuat pengguna. Periksa input.");
        }
    };
    
    const handleDelete = async (id, nama) => {
        if (window.confirm(`Yakin ingin menonaktifkan pengguna ${nama}?`)) {
            try {
                await deleteUser(id);
                alert(`${nama} berhasil dinonaktifkan.`);
                fetchUsersAndRoles(); // Refresh
            } catch (err) {
                setError("Gagal menonaktifkan pengguna.");
            }
        }
    };

    if (user?.role_id !== 1) {
        return <div className="notification error">Akses ditolak. Anda bukan Admin.</div>;
    }
    
    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading data pengguna...</div>; 
    
    return (
        <div>
            <div className="content-header">
                <h1>Manajemen Pengguna</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="fas fa-user-plus"></i> Tambah Pengguna
                </button>
            </div>
            
            {error && <div className="notification error">{error}</div>}

            <div className="card">
                <div className="card-header"><h4>Daftar Aparatur Desa</h4></div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr><th>No</th><th>Nama Lengkap</th><th>Email</th><th>Peran</th><th>Status</th><th>Aksi</th></tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((u, index) => (
                                        <tr key={u.id}>
                                            <td>{index + 1}</td>
                                            <td>{u.nama_lengkap}</td>
                                            <td>{u.email}</td>
                                            <td>{roles.find(r => r.id === u.role_id)?.nama_role || 'N/A'}</td>
                                            <td>
                                                <span className={`status ${u.deleted_at ? 'ditolak' : 'disetujui'}`}>
                                                    {u.deleted_at ? 'Nonaktif' : 'Aktif'}
                                                </span>
                                            </td>
                                            <td className="action-buttons">
                                                <button className="btn btn-sm btn-warning" title="Edit"><i className="fas fa-edit"></i></button>
                                                {!u.deleted_at && (
                                                    <button 
                                                        className="btn btn-sm btn-danger" 
                                                        title="Nonaktifkan" 
                                                        onClick={() => handleDelete(u.id, u.nama_lengkap)}
                                                    >
                                                        <i className="fas fa-user-slash"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" style={{textAlign: 'center'}}>Tidak ada data pengguna.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Pengguna */}
            {showModal && (
                <DummyModal onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit}>
                        {formError && <div className="notification error">{formError}</div>}
                        
                        <div className="form-group"><label>Nama Lengkap</label><input type="text" name="nama_lengkap" className="form-control" value={form.nama_lengkap} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Email</label><input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required /></div>
                        
                        <div className="form-group">
                            <label>Peran</label>
                            <select name="role_id" className="form-control" value={form.role_id} onChange={handleChange} required>
                                <option value="">-- Pilih Peran --</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.nama_role}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <input type="text" name="password" className="form-control" value={form.password} onChange={handleChange} required />
                                <button type="button" className="btn btn-secondary btn-sm" onClick={handleGeneratePassword} style={{minWidth: '150px'}}><i className="fas fa-key"></i> Generate</button>
                            </div>
                        </div>
                        <div className="form-group"><label>Konfirmasi Password</label><input type="text" name="password_confirmation" className="form-control" value={form.password_confirmation} onChange={handleChange} required /></div>

                        <button type="submit" className="btn btn-primary btn-block">Simpan Pengguna</button>
                    </form>
                </DummyModal>
            )}
        </div>
    );
}

export default ManajemenPenggunaPage;