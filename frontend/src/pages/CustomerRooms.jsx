import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function CustomerRooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

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
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter logic
  const filteredRooms = rooms.filter((room) => {
    const roomPrice = room.room_type?.price || 0;

    // Search by room number
    const matchSearch = room.room_number.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by type
    const matchType = selectedType ? room.room_type_id === parseInt(selectedType) : true;

    // Filter by price range
    const matchPriceMin = priceMin ? roomPrice >= parseInt(priceMin) : true;
    const matchPriceMax = priceMax ? roomPrice <= parseInt(priceMax) : true;

    return matchSearch && matchType && matchPriceMin && matchPriceMax;
  });

  // Check if room has active booking
  const hasActiveBooking = (roomId) => {
    return bookings.some((b) => b.room?.id === roomId && b.status === 'active');
  };

  // Only show available rooms for booking (support both Indonesian and English status)
  const availableRooms = filteredRooms.filter((r) => {
    const status = (r.status || '').toLowerCase();
    const statusAvailable = status === 'tersedia' || status === 'available' || status === '1' || status === 1;
    return statusAvailable && !hasActiveBooking(r.id);
  });
  const hasFilters = searchTerm || selectedType || priceMin || priceMax;

  if (loading) {
    return <div style={styles.loading}>Memuat data kamar...</div>;
  }

  return (
    <div>
      {/* Search & Filter Section */}
      <div style={styles.filterSection}>
        <h1 style={styles.filterTitle}>Cari Kamar</h1>
        <p style={styles.filterSubtitle}>Temukan kamar yang sesuai dengan kebutuhanmu</p>

        <div style={styles.filterGrid}>
          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>Cari Nomor Kamar</label>
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>Tipe Kamar</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={styles.filterInput}
            >
              <option value="">Semua Tipe</option>
              {roomTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.type_name}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>Harga Min</label>
            <input
              type="number"
              placeholder="Rp 0"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>Harga Max</label>
            <input
              type="number"
              placeholder="Rp 10jt"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              style={styles.filterInput}
            />
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('');
              setPriceMin('');
              setPriceMax('');
            }}
            style={styles.clearFilterBtn}
          >
            ✕ Hapus Filter
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>{rooms.length}</span>
          <span style={styles.statLabel}>Total Kamar</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>{availableRooms.length}</span>
          <span style={styles.statLabel}>Tersedia</span>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statNumber}>{roomTypes.length}</span>
          <span style={styles.statLabel}>Tipe Kamar</span>
        </div>
      </div>

      {/* Room Cards */}
      <h2 style={styles.sectionTitle}>
        {hasFilters ? 'Hasil Pencarian' : 'Kamar Tersedia'}
      </h2>

      {availableRooms.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>🏨</span>
          <p style={styles.emptyText}>
            {hasFilters ? 'Tidak ada kamar yang sesuai filter' : 'Tidak ada kamar yang tersedia saat ini'}
          </p>
        </div>
      ) : (
        <div style={styles.roomGrid}>
          {availableRooms.map((room) => (
            <div key={room.id} style={styles.roomCard}>
              <div style={styles.roomImagePlaceholder}>
                <span style={styles.roomImageEmoji}>🛏️</span>
              </div>
              <div style={styles.roomInfo}>
                <div style={styles.roomHeader}>
                  <h3 style={styles.roomNumber}>Kamar {room.room_number}</h3>
                  <span style={styles.roomBadge}>Tersedia</span>
                </div>
                <p style={styles.roomTypeName}>{room.room_type?.type_name}</p>
                <p style={styles.roomCapacity}>👥 Kapasitas: {room.room_type?.capacity} orang</p>
                <div style={styles.roomFooter}>
                  <span style={styles.roomPrice}>
                    {formatRupiah(room.room_type?.price)}
                    <span style={styles.roomPriceUnit}> / malam</span>
                  </span>
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

  // Filter Section
  filterSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px', padding: '35px 30px', marginBottom: '30px', color: 'white',
  },
  filterTitle: { fontSize: '26px', fontWeight: '700', marginBottom: '5px', margin: 0 },
  filterSubtitle: { fontSize: '14px', opacity: 0.9, marginBottom: '25px', margin: '5px 0 25px 0' },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
  },
  filterItem: { display: 'flex', flexDirection: 'column', gap: '5px' },
  filterLabel: { fontSize: '12px', fontWeight: '600', opacity: 0.9 },
  filterInput: {
    padding: '11px 14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  clearFilterBtn: {
    marginTop: '15px',
    padding: '8px 16px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  // Stats
  statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
  statBox: { flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  statNumber: { display: 'block', fontSize: '28px', fontWeight: '700', color: '#667eea' },
  statLabel: { fontSize: '13px', color: '#7f8c8d', marginTop: '5px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#2c3e50', marginBottom: '20px' },

  // Empty
  emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  emptyIcon: { fontSize: '48px', display: 'block', marginBottom: '15px' },
  emptyText: { color: '#7f8c8d', fontSize: '16px' },

  // Room Cards
  roomGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  roomCard: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  roomImagePlaceholder: { height: '150px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  roomImageEmoji: { fontSize: '52px' },
  roomInfo: { padding: '18px' },
  roomHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  roomNumber: { margin: 0, fontSize: '17px', fontWeight: '700', color: '#2c3e50' },
  roomBadge: { padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', backgroundColor: '#d4edda', color: '#155724' },
  roomTypeName: { fontSize: '14px', color: '#7f8c8d', marginBottom: '4px' },
  roomCapacity: { fontSize: '13px', color: '#95a5a6', marginBottom: '12px' },
  roomFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '12px' },
  roomPrice: { fontSize: '18px', fontWeight: '700', color: '#2c3e50' },
  roomPriceUnit: { fontSize: '11px', fontWeight: '400', color: '#95a5a6' },
};