import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import axios from 'axios';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('customer'); // 'customer' | 'admin'
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) navigate('/dashboard');
  }, [navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Ganti port 5000 & rute /api/login sesuai dengan backend asli Anda
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', 'admin');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Coba login customer dulu
      const loginRes = await api.post('/customer/login', {
        email: customerEmail,
        password: customerPassword,
      });

      const customer = loginRes.data.customer;
      localStorage.setItem('role', 'customer');
      localStorage.setItem('user', JSON.stringify({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: 'customer',
      }));
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Email atau password salah');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.brandSide}>
        <div style={styles.brandContent}>
          <div style={styles.logo}>RayBnB</div>
          <p style={styles.slogan}>Book, Stay, Relax.</p>
          <p style={styles.tagline}>Temukan penginapan terbaik untuk liburanmu</p>
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🔍</span>
              <span>Cari kamar mudah</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>💳</span>
              <span>Bayar aman & nyaman</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>⭐</span>
              <span>Hotel terbaik pilihan</span>
            </div>
          </div>
        </div>
        <div style={styles.decorCircle1} />
        <div style={styles.decorCircle2} />
        <div style={styles.decorCircle3} />
      </div>

      <div style={styles.authSide}>
        {mode === 'customer' ? (
          <div style={styles.loginCard}>
            <div style={styles.adminIcon}>👤</div>
            <h2 style={styles.loginTitle}>Masuk sebagai Pelanggan</h2>
            <p style={styles.loginSubtitle}>Masukkan data akun kamu untuk memesan kamar</p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleCustomerLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nama Lengkap</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={styles.input}
                  placeholder="Masukkan nama kamu"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={styles.input}
                  placeholder="contoh@email.com"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={customerPassword}
                  onChange={(e) => setCustomerPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>
              <button type="submit" style={styles.loginBtn} disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <p style={styles.registerHint}>
              Belum punya akun?{' '}
              <Link to="/register" style={styles.registerLink}>
                Daftar Sekarang
              </Link>
            </p>

            <button onClick={() => setMode('admin')} style={styles.switchBtn}>
              🔐 Masuk sebagai admin
            </button>
          </div>
        ) : (
          <div style={styles.loginCard}>
            <div style={styles.backBtn} onClick={() => { setMode('customer'); setError(''); }}>
              ← Kembali
            </div>
            <div style={styles.adminIcon}>🔐</div>
            <h2 style={styles.loginTitle}>Admin Login</h2>
            <p style={styles.loginSubtitle}>Masuk ke panel admin RayBnB</p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleAdminLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="admin@raybnb.com"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" style={styles.loginBtn} disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk sebagai Admin'}
              </button>
            </form>

            <button onClick={() => setMode('customer')} style={styles.switchBtn}>
              👤 Masuk sebagai pelanggan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  brandSide: {
    flex: 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', padding: '40px',
  },
  brandContent: { textAlign: 'center', color: 'white', zIndex: 2, maxWidth: '400px' },
  logo: { fontSize: '48px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '15px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' },
  slogan: { fontSize: '22px', fontWeight: '300', fontStyle: 'italic', marginBottom: '10px', opacity: 0.95 },
  tagline: { fontSize: '15px', opacity: 0.8, marginBottom: '50px', lineHeight: '1.5' },
  features: { display: 'flex', flexDirection: 'column', gap: '18px' },
  feature: { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.12)', padding: '14px 24px', borderRadius: '12px', backdropFilter: 'blur(10px)' },
  featureIcon: { fontSize: '22px' },
  decorCircle1: { position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: '-100px', right: '-100px' },
  decorCircle2: { position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: '50px', left: '-50px' },
  decorCircle3: { position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: '30%', left: '20%' },
  authSide: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fc', padding: '40px', minWidth: '450px' },
  loginCard: { maxWidth: '380px', width: '100%' },
  backBtn: { fontSize: '14px', color: '#667eea', cursor: 'pointer', fontWeight: '500', marginBottom: '30px', display: 'inline-block' },
  adminIcon: { fontSize: '48px', display: 'block', marginBottom: '15px' },
  loginTitle: { fontSize: '26px', fontWeight: '700', color: '#2c3e50', marginBottom: '8px' },
  loginSubtitle: { fontSize: '14px', color: '#7f8c8d', marginBottom: '30px' },
  error: { backgroundColor: '#fde8e8', color: '#e74c3c', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #f5c6cb' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#2c3e50' },
  input: { padding: '14px 16px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#f8f9fc', width: '100%', boxSizing: 'border-box' },
  loginBtn: { padding: '14px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '5px', transition: 'background-color 0.2s' },
  registerHint: { textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#7f8c8d' },
  registerLink: { color: '#667eea', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' },
  switchBtn: { marginTop: '20px', padding: '12px', backgroundColor: 'transparent', color: '#667eea', border: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%' },
};