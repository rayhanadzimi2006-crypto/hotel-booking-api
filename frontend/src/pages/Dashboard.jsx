import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// ==================== ADMIN DASHBOARD ====================
function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [yearlyStats, setYearlyStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, monthlyRes, yearlyRes, roomsRes, bookingsRes] = await Promise.all([
        api.get('/statistics'),
        api.get('/statistics/monthly'),
        api.get('/statistics/yearly'),
        api.get('/rooms'),
        api.get('/bookings'),
      ]);
      setStats(statsRes.data);
      setMonthlyStats(monthlyRes.data);
      setYearlyStats(yearlyRes.data);
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Determine if room is truly available based on active bookings
  const isRoomAvailable = (room) => {
    const hasActiveBooking = bookings.some(
      (b) => b.room?.id === room.id && b.status === 'active'
    );
    const status = (room.status || '').toLowerCase();
    const statusAvailable = status === 'available' || status === 'tersedia';
    // Room is available ONLY if status says available AND no active booking
    return statusAvailable && !hasActiveBooking;
  };

  // Get active booking for a room
  const getActiveBooking = (roomId) => {
    return bookings.find((b) => b.room?.id === roomId && b.status === 'active');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      <h1 style={styles.pageTitle}>Dashboard Admin</h1>
      <p style={styles.pageSubtitle}>Overview sistem RayBnB</p>

      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #667eea' }}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>{stats?.total_customers || 0}</div>
            <div style={styles.statLabel}>Total Customers</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid #2ecc71' }}>
          <div style={styles.statIcon}>🛏️</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>{stats?.total_rooms || 0}</div>
            <div style={styles.statLabel}>Total Rooms</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid #f39c12' }}>
          <div style={styles.statIcon}>📅</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>{stats?.total_bookings || 0}</div>
            <div style={styles.statLabel}>Total Bookings</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid #9b59b6' }}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statInfo}>
            <div style={styles.statNumber}>{formatRupiah(stats?.total_payments || 0)}</div>
            <div style={styles.statLabel}>Total Payments</div>
          </div>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #1abc9c' }}>
          <div style={styles.statInfo}>
            <div style={styles.statLabel}>Bulan Ini ({monthlyStats?.month}/{monthlyStats?.year})</div>
            <div style={styles.statNumber}>{monthlyStats?.total_transactions || 0}</div>
            <div style={styles.statLabel}>Transaksi</div>
            <div style={{ ...styles.statNumber, fontSize: '18px', marginTop: '10px' }}>
              {formatRupiah(monthlyStats?.total_income || 0)}
            </div>
            <div style={styles.statLabel}>Pendapatan</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid #e74c3c' }}>
          <div style={styles.statInfo}>
            <div style={styles.statLabel}>Tahun Ini ({yearlyStats?.year})</div>
            <div style={styles.statNumber}>{yearlyStats?.total_transactions || 0}</div>
            <div style={styles.statLabel}>Transaksi</div>
            <div style={{ ...styles.statNumber, fontSize: '18px', marginTop: '10px' }}>
              {formatRupiah(yearlyStats?.total_income || 0)}
            </div>
            <div style={styles.statLabel}>Pendapatan</div>
          </div>
        </div>
      </div>

      {/* Room Status Overview */}
      <h2 style={styles.sectionTitle}>Status Kamar</h2>
      <div style={styles.roomTableWrapper}>
        <table style={styles.roomTable}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>No. Kamar</th>
              <th style={styles.th}>Tipe</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Dibooking Oleh</th>
              <th style={styles.th}>Check In</th>
              <th style={styles.th}>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const available = isRoomAvailable(room);
              const activeBooking = getActiveBooking(room.id);
              
              return (
                <tr key={room.id} style={styles.tableRow}>
                  <td style={styles.td}>{room.room_number}</td>
                  <td style={styles.td}>{room.room_type?.type_name || '-'}</td>
                  <td style={styles.td}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: available ? '#d4edda' : '#f8d7da',
                      color: available ? '#155724' : '#721c24',
                    }}>
                      {available ? 'Tersedia' : 'Terisi'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {!available && activeBooking ? activeBooking.customer?.name || '-' : '-'}
                  </td>
                  <td style={styles.td}>
                    {!available && activeBooking ? formatDate(activeBooking.check_in) : '-'}
                  </td>
                  <td style={styles.td}>
                    {!available && activeBooking ? formatDate(activeBooking.check_out) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== CUSTOMER DASHBOARD ====================
function CustomerDashboard() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, typesRes, bookingsRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/room-types'),
          api.get('/bookings'),
        ]);
        setRooms(roomsRes.data);
        setRoomTypes(typesRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchSearch = room.room_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType ? room.room_type_id === parseInt(selectedType) : true;
    return matchSearch && matchType;
  });

  // Check if room has active booking
  const hasActiveBooking = (roomId) => {
    return bookings.some((b) => b.room?.id === roomId && b.status === 'active');
  };

  const getRoomStatus = (room) => {
    const status = (room.status || '').toLowerCase();
    const statusAvailable = status === 'available' || status === 'tersedia';
    const isAvailable = statusAvailable && !hasActiveBooking(room.id);
    return isAvailable ? 'available' : 'booked';
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Selamat Datang di RayBnB</h1>
        <p style={styles.heroSubtitle}>
          Lihat status kamar yang tersedia
        </p>
      </div>

      {/* Stats */}
      <div style={styles.customerStats}>
        <div style={styles.customerStat}>
          <span style={styles.customerStatNumber}>{rooms.length}</span>
          <span style={styles.customerStatLabel}>Total Kamar</span>
        </div>
        <div style={styles.customerStat}>
          <span style={styles.customerStatNumber}>
            {rooms.filter((r) => getRoomStatus(r) === 'available').length}
          </span>
          <span style={styles.customerStatLabel}>Tersedia</span>
        </div>
        <div style={styles.customerStat}>
          <span style={styles.customerStatNumber}>
            {rooms.filter((r) => getRoomStatus(r) === 'booked').length}
          </span>
          <span style={styles.customerStatLabel}>Sedang Dibooking</span>
        </div>
      </div>

      {/* Room Status Overview */}
      <h2 style={styles.sectionTitle}>Status Kamar</h2>
      <div style={styles.roomTableWrapper}>
        <table style={styles.roomTable}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>No. Kamar</th>
              <th style={styles.th}>Tipe</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const status = getRoomStatus(room);
              const isAvailable = status === 'available';
              
              return (
                <tr key={room.id} style={styles.tableRow}>
                  <td style={styles.td}>{room.room_number}</td>
                  <td style={styles.td}>{room.room_type?.type_name || '-'}</td>
                  <td style={styles.td}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: isAvailable ? '#d4edda' : '#f8d7da',
                      color: isAvailable ? '#155724' : '#721c24',
                    }}>
                      {isAvailable ? 'Tersedia' : 'Terisi'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== MAIN DASHBOARD ====================
export default function Dashboard() {
  const role = localStorage.getItem('role') || 'customer';
  return role === 'admin' ? <AdminDashboard /> : <CustomerDashboard />;
}

// ==================== STYLES ====================
const styles = {
  pageTitle: {
    margin: '0 0 5px 0',
    color: '#2c3e50',
    fontSize: '28px',
  },
  pageSubtitle: {
    margin: '0 0 30px 0',
    color: '#7f8c8d',
    fontSize: '16px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#7f8c8d',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  statIcon: {
    fontSize: '36px',
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginTop: '5px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '20px',
    marginTop: '10px',
  },

  // Admin Room Table
  roomTableWrapper: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  roomTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f8f9fc',
    borderBottom: '2px solid #e0e0e0',
  },
  th: {
    padding: '14px 18px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '700',
    color: '#2c3e50',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0',
  },
  td: {
    padding: '14px 18px',
    fontSize: '14px',
    color: '#555',
  },

  // Customer styles
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '50px 40px',
    textAlign: 'center',
    marginBottom: '30px',
    color: 'white',
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '10px',
  },
  heroSubtitle: {
    fontSize: '16px',
    opacity: 0.9,
    marginBottom: '30px',
  },
  searchBar: {
    display: 'flex',
    gap: '12px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  searchInput: {
    flex: 1,
    padding: '14px 20px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
  },
  searchSelect: {
    padding: '14px 20px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    minWidth: '150px',
  },
  customerStats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
  },
  customerStat: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  customerStatNumber: {
    display: 'block',
    fontSize: '28px',
    fontWeight: '700',
    color: '#667eea',
  },
  customerStatLabel: {
    fontSize: '13px',
    color: '#7f8c8d',
    marginTop: '5px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '15px',
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: '16px',
  },
  roomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  roomCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  roomImagePlaceholder: {
    height: '160px',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomImageEmoji: {
    fontSize: '56px',
  },
  roomInfo: {
    padding: '20px',
  },
  roomHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  roomNumber: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#2c3e50',
  },
  roomBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
  },
  roomType: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '6px',
  },
  roomCapacity: {
    fontSize: '13px',
    color: '#95a5a6',
    marginBottom: '15px',
  },
  roomFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '15px',
  },
  roomPrice: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2c3e50',
  },
  roomPriceUnit: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#95a5a6',
  },
  bookBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  bookedLabel: {
    padding: '10px 20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
};