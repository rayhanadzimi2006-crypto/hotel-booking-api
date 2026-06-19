import { useState, useEffect } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ customer_id: '', room_id: '', check_in: '', check_out: '', total_price: '' });

  const columns = [
    { key: 'id', label: 'ID', render: (v) => `#${v}` },
    { key: 'customer', label: 'Customer', render: (v) => v?.name || '-' },
    { key: 'room', label: 'Kamar', render: (v) => v?.room_number || '-' },
    { key: 'check_in', label: 'Check In' },
    { key: 'check_out', label: 'Check Out' },
    { key: 'total_price', label: 'Total Harga', render: (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v) },
    { 
      key: 'status', 
      label: 'Status', 
      render: (v) => {
        const colors = { pending: '#fff3cd', active: '#d4edda', completed: '#cce5ff', cancelled: '#f8d7da' };
        const textColors = { pending: '#856404', active: '#155724', completed: '#004085', cancelled: '#721c24' };
        const labels = { pending: 'Menunggu', active: 'Aktif', completed: 'Selesai', cancelled: 'Dibatalkan' };
        return (
          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: colors[v] || '#eee', color: textColors[v] || '#333' }}>
            {labels[v] || v}
          </span>
        );
      }
    },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [bookingRes, customerRes, roomRes] = await Promise.all([
          api.get('/bookings'), api.get('/customers'), api.get('/rooms'),
        ]);
        setBookings(bookingRes.data);
        setCustomers(customerRes.data);
        setRooms(roomRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setForm({ customer_id: '', room_id: '', check_in: '', check_out: '', total_price: '' });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditing(item);
    setForm({ customer_id: item.customer_id, room_id: item.room_id, check_in: item.check_in, check_out: item.check_out, total_price: item.total_price });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/bookings/${editing.id}`, form);
      else await api.post('/bookings', form);
      setModalOpen(false);
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan data'); }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Yakin ingin menghapus booking #${item.id}?`)) return;
    try {
      await api.delete(`/bookings/${item.id}`);
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menghapus data'); }
  };

  const handleConfirmBooking = async (booking) => {
    if (!window.confirm(`Konfirmasi booking #${booking.id}? Kamar ${booking.room?.room_number} akan dibooking.`)) return;
    try {
      await api.patch(`/bookings/${booking.id}/status`, { status: 'active' });
      alert('Booking berhasil dikonfirmasi!');
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) { alert(err.response?.data?.message || 'Gagal konfirmasi booking'); }
  };

  const handleRejectBooking = async (booking) => {
    if (!window.confirm(`Tolak booking #${booking.id}? Kamar akan tersedia kembali.`)) return;
    try {
      await api.patch(`/bookings/${booking.id}/status`, { status: 'cancelled' });
      alert('Booking berhasil ditolak.');
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menolak booking'); }
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Kelola Booking</h1>
          <p style={styles.pageSubtitle}>Manajemen data pemesanan kamar</p>
        </div>
        <button onClick={openAddModal} style={styles.addBtn}>+ Tambah Booking</button>
      </div>
      <DataTable 
        columns={columns} 
        data={bookings} 
        loading={loading}
        renderActions={(booking) => (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {booking.status === 'pending' && (
              <>
                <button onClick={() => handleConfirmBooking(booking)} style={{ padding: '6px 10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                  ✅ Konfirmasi
                </button>
                <button onClick={() => handleRejectBooking(booking)} style={{ padding: '6px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                  ❌ Tolak
                </button>
              </>
            )}
            {booking.status !== 'pending' && (
              <>
                <button onClick={() => openEditModal(booking)} style={{ padding: '6px 10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(booking)} style={{ padding: '6px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                  🗑️ Hapus
                </button>
              </>
            )}
          </div>
        )}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Booking' : 'Tambah Booking'}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Customer</label>
            <select style={styles.input} value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required>
              <option value="">Pilih customer</option>
              {customers.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Kamar</label>
            <select style={styles.input} value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })} required>
              <option value="">Pilih kamar</option>
              {rooms.map((r) => (<option key={r.id} value={r.id}>{r.room_number} - {r.room_type?.type_name}</option>))}
            </select>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Check In</label>
            <input type="date" style={styles.input} value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Check Out</label>
            <input type="date" style={styles.input} value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Total Harga (Rp)</label>
            <input type="number" style={styles.input} value={form.total_price} onChange={(e) => setForm({ ...form, total_price: e.target.value })} placeholder="500000" required />
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