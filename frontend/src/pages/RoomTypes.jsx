import { useState, useEffect } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function RoomTypes() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ type_name: '', price: '', capacity: '' });

  const columns = [
    { key: 'type_name', label: 'Tipe Kamar' },
    {
      key: 'price',
      label: 'Harga',
      render: (value) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(value),
    },
    { key: 'capacity', label: 'Kapasitas' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/room-types');
      setRoomTypes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditing(null);
    setForm({ type_name: '', price: '', capacity: '' });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditing(item);
    setForm({
      type_name: item.type_name,
      price: item.price,
      capacity: item.capacity,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/room-types/${editing.id}`, form);
      } else {
        await api.post('/room-types', form);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Yakin ingin menghapus room type "${item.type_name}"?`)) return;
    try {
      await api.delete(`/room-types/${item.id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value.replace(/\D/g, '') || 0);
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Room Types</h1>
          <p style={styles.pageSubtitle}>Kelola tipe kamar hotel</p>
        </div>
        <button onClick={openAddModal} style={styles.addBtn}>
          + Tambah Room Type
        </button>
      </div>

      <DataTable
        columns={columns}
        data={roomTypes}
        onEdit={openEditModal}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Room Type' : 'Tambah Room Type'}
      >
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nama Tipe</label>
            <input
              style={styles.input}
              value={form.type_name}
              onChange={(e) => setForm({ ...form, type_name: e.target.value })}
              placeholder="Contoh: Deluxe, Standard, Suite"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Harga per Malam (Rp)</label>
            <input
              type="number"
              style={styles.input}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="500000"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Kapasitas</label>
            <input
              type="number"
              style={styles.input}
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              placeholder="2"
              required
            />
          </div>
          <button type="submit" style={styles.submitBtn}>
            {editing ? 'Update' : 'Simpan'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
  },
  pageTitle: {
    margin: '0 0 5px 0',
    color: '#2c3e50',
    fontSize: '28px',
  },
  pageSubtitle: {
    margin: 0,
    color: '#7f8c8d',
    fontSize: '16px',
  },
  addBtn: {
    padding: '12px 24px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50',
  },
  input: {
    padding: '10px 12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  submitBtn: {
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
};