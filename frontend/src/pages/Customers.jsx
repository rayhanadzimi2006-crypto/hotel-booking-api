import { useState, useEffect } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  const columns = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Telepon' },
    { key: 'address', label: 'Alamat' },
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setForm({ name: '', email: '', phone: '', address: '' });
    setModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, form);
      } else {
        await api.post('/customers', form);
      }
      setModalOpen(false);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Yakin ingin menghapus customer "${customer.name}"?`)) return;
    try {
      await api.delete(`/customers/${customer.id}`);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Customers</h1>
          <p style={styles.pageSubtitle}>Kelola data pelanggan hotel</p>
        </div>
        <button onClick={openAddModal} style={styles.addBtn}>
          + Tambah Customer
        </button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        onEdit={openEditModal}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Tambah Customer'}
      >
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nama</label>
            <input
              style={styles.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Telepon</label>
            <input
              style={styles.input}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Alamat</label>
            <textarea
              style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>
          <button type="submit" style={styles.submitBtn}>
            {editingCustomer ? 'Update' : 'Simpan'}
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