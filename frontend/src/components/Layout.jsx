import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const adminMenuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/customers', label: 'Customers', icon: '👥' },
  { path: '/room-types', label: 'Room Types', icon: '🏷️' },
  { path: '/rooms', label: 'Rooms', icon: '🛏️' },
  { path: '/payments', label: 'Payments', icon: '💳' },
];

const customerMenuItems = [
  { path: '/dashboard', label: 'Beranda', icon: '🏠' },
  { path: '/rooms', label: 'Cari Kamar', icon: '🔍' },
  { path: '/my-rooms', label: 'Kamar Saya', icon: '🛏️' },
  { path: '/bookings', label: 'Riwayat Booking', icon: '📋' },
];

// ==================== KONFIRMASI LOGOUT PILL ====================
function ConfirmLogout({ onConfirm, onCancel }) {
  return (
    <div style={styles.confirmOverlay}>
      <div style={styles.confirmPill}>
        <span style={styles.confirmIcon}>🚪</span>
        <span style={styles.confirmText}>Yakin mau keluar?</span>
        <div style={styles.confirmActions}>
          <button onClick={onConfirm} style={styles.confirmYesBtn}>
            Ya, Keluar
          </button>
          <button onClick={onCancel} style={styles.confirmNoBtn}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = localStorage.getItem('role') || 'customer';
  const isAdmin = role === 'admin';

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  const handleLogout = async () => {
    if (isAdmin) {
      try {
        await api.post('/logout');
      } catch (e) {
        // ignore error
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, width: sidebarOpen ? 250 : 60 }}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.logo}>
            {sidebarOpen ? (isAdmin ? '⚙️ RayBnB Admin' : '🏨 RayBnB') : isAdmin ? '⚙️' : '🏨'}
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.toggleBtn}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {isAdmin && (
          <div style={styles.adminBadge}>
            <span style={styles.adminBadgeIcon}>🔐</span>
            {sidebarOpen && <span style={styles.adminBadgeText}>Panel Admin</span>}
          </div>
        )}

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.menuItem,
                backgroundColor:
                  location.pathname === item.path ? '#3498db' : 'transparent',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                padding: sidebarOpen ? '12px 20px' : '12px',
              }}
            >
              <span style={styles.menuIcon}>{item.icon}</span>
              {sidebarOpen && <span style={styles.menuLabel}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <span style={styles.userIcon}>👤</span>
            {sidebarOpen && (
              <div>
                <div style={styles.userName}>{user.name || 'Guest'}</div>
                <div style={styles.userRole}>{isAdmin ? 'Admin' : 'Pelanggan'}</div>
              </div>
            )}
          </div>
          <button onClick={() => setShowLogoutConfirm(true)} style={styles.logoutBtn}>
            {sidebarOpen ? 'Keluar' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ ...styles.mainContent, marginLeft: sidebarOpen ? 250 : 60 }}>
        <div style={styles.content}>{children}</div>
      </div>

      {/* Logout Confirmation Pill */}
      {showLogoutConfirm && (
        <ConfirmLogout
          onConfirm={() => {
            setShowLogoutConfirm(false);
            handleLogout();
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    backgroundColor: '#1a1a2e',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 100,
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 15px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logo: {
    margin: 0,
    fontSize: '1.1rem',
    whiteSpace: 'nowrap',
    fontWeight: '700',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '5px',
    opacity: 0.7,
  },
  adminBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    backgroundColor: 'rgba(52,152,219,0.15)',
    margin: '10px',
    borderRadius: '8px',
  },
  adminBadgeIcon: { fontSize: '16px' },
  adminBadgeText: { fontSize: '12px', fontWeight: '600', color: '#3498db' },
  nav: { flex: 1, paddingTop: '10px' },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: '15px',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    margin: '2px 10px',
    borderRadius: '8px',
  },
  menuIcon: { fontSize: '20px', minWidth: '24px', textAlign: 'center' },
  menuLabel: { fontSize: '14px' },
  sidebarFooter: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '15px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  userIcon: { fontSize: '24px' },
  userName: { fontSize: '14px', fontWeight: '600' },
  userRole: { fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'rgba(231,76,60,0.2)',
    color: '#e74c3c',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    minHeight: '100vh',
    transition: 'margin-left 0.3s ease',
  },
  content: { padding: '30px' },

  // Confirm Logout Pill Styles
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  confirmPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: 'white',
    padding: '16px 28px',
    borderRadius: '50px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    animation: 'slideUp 0.2s ease',
  },
  confirmIcon: { fontSize: '22px' },
  confirmText: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#2c3e50',
    whiteSpace: 'nowrap',
  },
  confirmActions: {
    display: 'flex',
    gap: '8px',
  },
  confirmYesBtn: {
    padding: '8px 18px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  confirmNoBtn: {
    padding: '8px 18px',
    backgroundColor: '#ecf0f1',
    color: '#555',
    border: 'none',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};