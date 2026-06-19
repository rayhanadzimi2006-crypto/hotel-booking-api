import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [selectedType, setSelectedType] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, typesRes, roomsRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/room-types'),
          api.get('/rooms'),
        ]);
    setBookings(bookingRes.data);
    setRoomTypes(typesRes.data);
    setRooms(roomsRes.data.filter((r) => {
      const status = (r.status || '').toLowerCase();
      const statusAvailable = status === 'available' || status === 'tersedia';
      const hasActive = bookingRes.data.some((b) => b.room?.id === r.id && b.status === 'active');
      return statusAvailable && !hasActive;
    }));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  useEffect(() => {
    if (selectedRoom && checkIn && checkOut) {
      const room = rooms.find((r) => r.id === parseInt(selectedRoom));
      if (room) {
        const days = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
        setTotalPrice((room.room_type?.price || 0) * days);
      }
    } else {
      setTotalPrice(0);
    }
  }, [selectedRoom, checkIn, checkOut, rooms]);

  const filteredRooms = selectedType
    ? rooms.filter((r) => r.room_type_id === parseInt(selectedType))
    : rooms;

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setSubmitting(true);

    if (!user.id) {
      setBookingError('Silakan login ulang sebagai pelanggan');
      setSubmitting(false);
      return;
    }

    try {
      const bookingRes = await api.post('/bookings', {
        customer_id: user.id,
        room_id: parseInt(selectedRoom),
        check_in: checkIn,
        check_out: checkOut,
        total_price: totalPrice,
        payment_method: paymentMethod,
      });

      const isCash = paymentMethod === 'cash';
      alert(isCash ? 'Booking berhasil dikonfirmasi!' : 'Booking berhasil dibuat! Menunggu konfirmasi admin.');
      setShowForm(false);
      resetForm();
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Gagal membuat booking');
    } finally {
      setSubmitting(false);
    }
  };

  // Note: Customers cannot cancel bookings directly. Only admin can cancel.

  const resetForm = () => {
    setSelectedType('');
    setSelectedRoom('');
    setCheckIn('');
    setCheckOut('');
    setTotalPrice(0);
    setPaymentMethod('cash');
    setBookingError('');
  };

  const userBookings = bookings.filter((b) => b.customer?.id === user.id || b.customer?.email === user.email);

  const filteredBookings = activeTab === 'all'
    ? userBookings
    : userBookings.filter((b) => b.status === activeTab);

  const countByStatus = (status) => userBookings.filter((b) => b.status === status).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return <div style={styles.loading}>Memuat data...</div>;

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Pemesanan Saya</h1>
          <p style={styles.pageSubtitle}>Kelola pemesanan kamar kamu</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.addBtn}>
            + Booking Baru
          </button>
        )}
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h3 style={styles.formTitle}>Booking Kamar Baru</h3>
            <button onClick={() => { setShowForm(false); resetForm(); }} style={styles.closeFormBtn}>✕</button>
          </div>
          <form onSubmit={handleCreateBooking} style={styles.form}>
            {bookingError && <div style={styles.error}>{bookingError}</div>}

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Tipe Kamar</label>
                <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value); setSelectedRoom(''); }} style={styles.input}>
                  <option value="">Pilih tipe kamar</option>
                  {roomTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.type_name} - {formatRupiah(t.price)}/malam</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Pilih Kamar</label>
                <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} style={styles.input} required>
                  <option value="">Pilih kamar tersedia</option>
                  {filteredRooms.map((r) => (
                    <option key={r.id} value={r.id}>Kamar {r.room_number} - {r.room_type?.type_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Check In</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={styles.input} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Check Out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={styles.input} required />
              </div>
            </div>

            {totalPrice > 0 && (
              <div style={styles.pricePreview}>
                <span>Total Harga:</span>
                <strong>{formatRupiah(totalPrice)}</strong>
              </div>
            )}

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Metode Pembayaran</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={styles.input}>
                  <option value="cash">Cash (Bayar di tempat)</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="e-wallet">E-Wallet</option>
                  <option value="credit_card">Credit Card</option>
                </select>
              </div>
            </div>

            <div style={{ ...styles.infoBox, backgroundColor: paymentMethod === 'cash' ? '#d4edda' : '#fff3cd', color: paymentMethod === 'cash' ? '#155724' : '#856404' }}>
              {paymentMethod === 'cash' 
                ? '✅ Bayar di tempat: Booking akan langsung dikonfirmasi.' 
                : <>💡 Booking akan masuk sebagai <strong>Menunggu Konfirmasi</strong>. Admin akan review pembayaran Anda.</>}
            </div>

            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Memproses...' : paymentMethod === 'cash' ? 'Konfirmasi Booking' : 'Kirim Permintaan Booking'}
            </button>
          </form>
        </div>
      )}

      <div style={styles.tabsContainer}>
        {['all', 'pending', 'active', 'completed', 'cancelled'].map((tab) => {
          const labels = { all: 'Semua', pending: 'Menunggu', active: 'Aktif', completed: 'Selesai', cancelled: 'Dibatalkan' };
          const counts = { all: userBookings.length, pending: countByStatus('pending'), active: countByStatus('active'), completed: countByStatus('completed'), cancelled: countByStatus('cancelled') };
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.tab, backgroundColor: activeTab === tab ? '#667eea' : 'transparent', color: activeTab === tab ? 'white' : '#555' }}>
              {labels[tab]}
              {counts[tab] > 0 && <span style={styles.tabCount}>{counts[tab]}</span>}
            </button>
          );
        })}
      </div>

      {filteredBookings.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📋</span>
          <p style={styles.emptyText}>{activeTab === 'all' ? 'Belum ada pemesanan' : `Tidak ada booking ${activeTab}`}</p>
        </div>
      ) : (
        <div style={styles.bookingList}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} style={styles.bookingCard}>
              <div style={styles.bookingHeader}>
                <div style={styles.bookingHeaderLeft}>
                  <span style={styles.bookingId}>Booking #{booking.id}</span>
                  <span style={{ ...styles.bookingStatus, backgroundColor: booking.status === 'active' ? '#d4edda' : booking.status === 'pending' ? '#fff3cd' : booking.status === 'completed' ? '#cce5ff' : '#f8d7da', color: booking.status === 'active' ? '#155724' : booking.status === 'pending' ? '#856404' : booking.status === 'completed' ? '#004085' : '#721c24' }}>
                    {booking.status === 'active' ? 'Aktif' : booking.status === 'pending' ? 'Menunggu' : booking.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                  </span>
                </div>
              </div>
              <div style={styles.bookingDetails}>
                <div style={styles.bookingDetail}>
                  <span style={styles.detailLabel}>Kamar</span>
                  <span style={styles.detailValue}>Kamar {booking.room?.room_number} ({booking.room?.room_type?.type_name})</span>
                </div>
                <div style={styles.bookingDetail}>
                  <span style={styles.detailLabel}>Check In</span>
                  <span style={styles.detailValue}>{formatDate(booking.check_in)}</span>
                </div>
                <div style={styles.bookingDetail}>
                  <span style={styles.detailLabel}>Check Out</span>
                  <span style={styles.detailValue}>{formatDate(booking.check_out)}</span>
                </div>
                <div style={styles.bookingDetail}>
                  <span style={styles.detailLabel}>Total Harga</span>
                  <span style={{ ...styles.detailValue, fontWeight: '700', color: '#2c3e50', fontSize: '16px' }}>{formatRupiah(booking.total_price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  loading: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#7f8c8d' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' },
  pageTitle: { margin: '0 0 5px 0', color: '#2c3e50', fontSize: '26px' },
  pageSubtitle: { margin: 0, color: '#7f8c8d', fontSize: '14px' },
  addBtn: { padding: '12px 24px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  formCard: { backgroundColor: 'white', borderRadius: '12px', padding: '25px', marginBottom: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  formTitle: { margin: 0, color: '#2c3e50', fontSize: '18px' },
  closeFormBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#7f8c8d', padding: '5px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formRow: { display: 'flex', gap: '16px' },
  inputGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#2c3e50' },
  input: { padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  pricePreview: { padding: '12px 16px', backgroundColor: '#e8f5e9', borderRadius: '8px', color: '#2e7d32', fontSize: '18px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px' },
  submitBtn: { padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  error: { backgroundColor: '#fde8e8', color: '#e74c3c', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', textAlign: 'center', border: '1px solid #f5c6cb' },
  tabsContainer: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: { padding: '10px 20px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' },
  tabCount: { padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.1)', fontSize: '11px' },
  emptyState: { textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  emptyIcon: { fontSize: '48px', display: 'block', marginBottom: '15px' },
  emptyText: { color: '#7f8c8d', fontSize: '16px' },
  bookingList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  bookingCard: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  bookingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#f8f9fc', borderBottom: '1px solid #f0f0f0' },
  bookingHeaderLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  bookingId: { fontWeight: '700', color: '#2c3e50', fontSize: '14px' },
  bookingStatus: { padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' },
  cancelBtn: { padding: '6px 14px', backgroundColor: '#fde8e8', color: '#e74c3c', border: '1px solid #f5c6cb', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  bookingDetails: { padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' },
  bookingDetail: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { color: '#7f8c8d', fontSize: '13px' },
  detailValue: { color: '#555', fontSize: '13px', textAlign: 'right' },
};