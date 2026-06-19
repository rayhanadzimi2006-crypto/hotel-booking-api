import { useState, useEffect } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    booking_id: '',
    payment_date: '',
    amount: '',
    payment_method: 'cash',
  });

  const columns = [
    {
      key: 'booking',
      label: 'Booking ID',
      render: (value) => `#${value?.id || '-'}`,
    },
    { key: 'payment_date', label: 'Tanggal Bayar' },
    {
      key: 'amount',
      label: 'Jumlah',
      render: (value) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(value),
    },
    { key: 'payment_method', label: 'Metode Bayar' },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [paymentRes, bookingRes] = await Promise.all([
          api.get('/payments'),
          api.get('/bookings'),
        ]);
        setPayments(paymentRes.data);
        setBookings(bookingRes.data);
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
    setForm({ booking_id: '', payment_date: '', amount: '', payment_method: 'cash' });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditing(item);
    setForm({
      booking_id: item.booking_id,
      payment_date: item.payment_date,
      amount: item.amount,
      payment_method: item.payment_method,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/payments/${editing.id}`, form);
      } else {
        await api.post('/payments', form);
      }
      setModalOpen(false);
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Yakin ingin menghapus payment ini?`)) return;
    try {
      await api.delete(`/payments/${item.id}`);
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Payments</h1>
          <p style={styles.pageSubtitle}>Kelola data pembayaran</p>
        </div>
        <button onClick={openAddModal} style={styles.addBtn}>
          + Tambah Payment
        </button>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        onEdit={openEditModal}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Payment' : 'Tambah Payment'}
      >
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Booking</label>
            <select
              style={styles.input}
              value={form.booking_id}
              onChange={(e) => setForm({ ...form, booking_id: e.target.value })}
              required
            >
              <option value="">Pilih booking</option>
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  #{b.id} - {b.customer?.name} ({b.room?.room_number})
                </option>
              ))}
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tanggal Bayar</label>
            <input
              type="date"
              style={styles.input}
              value={form.payment_date}
              onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Jumlah (Rp)</label>
            <input
              type="number"
              style={styles.input}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="500000"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Metode Pembayaran</label>
            <select
              style={styles.input}
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              required
            >
              <option value="cash">Cash</option>
              <option value="transfer">Transfer</option>
              <option value="credit_card">Kartu Kredit</option>
              <option value="debit_card">Kartu Debit</option>
            </select>
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