import { useState, useEffect } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ room_number: '', room_type_id: '', status: 'available' });

  const columns = [
    { key: 'room_number', label: 'No. Kamar' },
    {
      key: 'room_type',
      label: 'Tipe Kamar',
      render: (value) => value?.type_name || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const s = (value || '').toLowerCase();
        const bg = s === 'available' ? '#d4edda' : s === 'occupied' || s === 'booked' ? '#f8d7da' : '#fff3cd';
        const color = s === 'available' ? '#155724' : s === 'occupied' || s === 'booked' ? '#721c24' : '#856404';
        const label = s === 'available' ? 'Tersedia' : s === 'occupied' || s === 'booked' ? 'Terisi' : 'Perbaikan';
        return (
          <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: bg, color }}>
            {label}
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [roomsRes, typesRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/room-types'),
        ]);
        setRooms(roomsRes.data);
        setRoomTypes(typesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setForm({ room_number: '', room_type_id: '', status: 'available' });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditing(item);
    setForm({
      room_number: item.room_number,
      room_type_id: item.room_type_id,
      status: item.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/rooms/${editing.id}`, form);
      } else {
        await api.post('/rooms', form);
      }
      setModalOpen(false);
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Yakin ingin menghapus kamar "${item.room_number}"?`)) return;
    try {
      await api.delete(`/rooms/${item.id}`);
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Kelola Kamar</h1>
          <p style={styles.pageSubtitle}>Manajemen data kamar hotel</p>
        </div>
        <button onClick={openAddModal} style={styles.addBtn}>+ Tambah Kamar</button>
      </div>
      <DataTable columns={columns} data={rooms} onEdit={openEditModal} onDelete={handleDelete} loading={loading} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Kamar' : 'Tambah Kamar'}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nomor Kamar</label>
            <input style={styles.input} value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })} placeholder="101" required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tipe Kamar</label>
            <select style={styles.input} value={form.room_type_id} onChange={(e) => setForm({ ...form, room_type_id: e.target.value })} required>
              <option value="">Pilih tipe kamar</option>
              {roomTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.type_name}</option>
              ))}
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Status</label>
            <select style={styles.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required>
              <option value="available">Available (Tersedia)</option>
              <option value="occupied">Occupied (Terisi)</option>
              <option value="maintenance">Maintenance (Perbaikan)</option>
            </select>
          </div>
          <button type="submit" style={styles.submitBtn}>{editing ? 'Update' : 'Simpan'}</button>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' },
  pageTitle: { margin: '0 0 5px 0', color: '#2c3e50', fontSize: '28px' },
  pageSubtitle: { margin: 0, color: '#7f8c8d', fontSize: '16px' },
  addBtn: { padding: '12px 24px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#2c3e50' },
  input: { padding: '10px 12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  submitBtn: { padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
};