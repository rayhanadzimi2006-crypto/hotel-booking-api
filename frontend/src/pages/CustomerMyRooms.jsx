import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function CustomerMyRooms() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCheckout = async (bookingId) => {
    if (!window.confirm('Yakin ingin checkout sekarang? Kamar akan tersedia kembali.')) return;
    try {
      setCheckingOut(bookingId);
      await api.post(`/bookings/${bookingId}/checkout`);
      alert('Checkout berhasil!');
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal checkout');
    } finally {
      setCheckingOut(null);
    }
  };

  // Filter bookings for current user with active/completed status
  const myBookings = bookings.filter((b) => {
    const isMyBooking = b.customer?.id === user.id || b.customer?.email === user.email;
    const isActiveOrCompleted = b.status === 'active' || b.status === 'completed';
    return isMyBooking && isActiveOrCompleted;
  });

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#7f8c8d' }}>Memuat data...</div>;

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '28px' }}>Kamar Saya</h1>
        <p style={{ margin: 0, color: '#7f8c8d', fontSize: '16px' }}>Riwayat kamar yang telah kamu booking</p>
      </div>

      {myBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>🛏️</span>
          <p style={{ color: '#7f8c8d', fontSize: '16px' }}>Belum ada riwayat booking kamar</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {myBookings.map((booking) => (
            <div key={booking.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#f8f9fc', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: '700', color: '#2c3e50', fontSize: '14px' }}>Booking #{booking.id}</span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: booking.status === 'active' ? '#d4edda' : '#cce5ff',
                    color: booking.status === 'active' ? '#155724' : '#004085',
                  }}>
                    {booking.status === 'active' ? 'Aktif' : 'Selesai'}
                  </span>
                </div>
                {booking.status === 'active' && (
                  <button
                    onClick={() => handleCheckout(booking.id)}
                    disabled={checkingOut === booking.id}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: checkingOut === booking.id ? '#95a5a6' : '#e67e22',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: checkingOut === booking.id ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {checkingOut === booking.id ? 'Processing...' : 'Checkout'}
                  </button>
                )}
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#7f8c8d', fontSize: '13px' }}>Kamar</span>
                  <span style={{ color: '#555', fontSize: '13px', textAlign: 'right', fontWeight: '600' }}>
                    Kamar {booking.room?.room_number} ({booking.room?.room_type?.type_name})
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#7f8c8d', fontSize: '13px' }}>Check In</span>
                  <span style={{ color: '#555', fontSize: '13px', textAlign: 'right' }}>{formatDate(booking.check_in)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#7f8c8d', fontSize: '13px' }}>Check Out</span>
                  <span style={{ color: '#555', fontSize: '13px', textAlign: 'right' }}>{formatDate(booking.check_out)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '10px', marginTop: '5px' }}>
                  <span style={{ color: '#7f8c8d', fontSize: '13px' }}>Total Harga</span>
                  <span style={{ fontWeight: '700', color: '#2c3e50', fontSize: '16px' }}>{formatRupiah(booking.total_price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}