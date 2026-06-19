import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (form.password !== form.password_confirmation) {
      setError('Password dan konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    try {
      await api.post('/customer/register', {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        address: form.address || null,
        password: form.password,
      });

      setSuccess('Akun berhasil dibuat! Mengalihkan ke login...');

      // Isi form login dengan data yang baru didaftarkan
      setTimeout(() => {
        navigate('/login', {
          state: {
            registerSuccess: true,
            email: form.email,
          },
        });
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal';
      if (typeof msg === 'string') {
        setError(msg);
      } else {
        setError(Object.values(msg).flat().join(', '));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left side - Branding */}
      <div style={styles.brandSide}>
        <div style={styles.brandContent}>
          <div style={styles.logo}>RayBnB</div>
          <p style={styles.slogan}>Book, Stay, Relax.</p>
          <p style={styles.tagline}>Daftar akun dan mulai pesan kamar impianmu</p>
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

      {/* Right side - Register Form */}
      <div style={styles.authSide}>
        <div style={styles.formCard}>
          <div style={styles.adminIcon}>📝</div>
          <h2 style={styles.formTitle}>Daftar Akun Baru</h2>
          <p style={styles.formSubtitle}>Isi data diri kamu untuk membuat akun</p>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nama Lengkap *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="contoh@email.com"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>No. Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="08123456789"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Alamat</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  style={{ ...styles.input, minHeight: '70px', resize: 'vertical' }}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Konfirmasi Password *</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Ulangi password"
                  required
                />
              </div>
            </div>

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Mendaftarkan...' : 'Daftar Akun'}
            </button>
          </form>

          <p style={styles.loginHint}>
            Sudah punya akun?{' '}
            <Link to="/login" style={styles.loginLink}>Masuk di sini</Link>
          </p>
        </div>
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
  formCard: { maxWidth: '480px', width: '100%' },
  adminIcon: { fontSize: '48px', display: 'block', marginBottom: '15px' },
  formTitle: { fontSize: '26px', fontWeight: '700', color: '#2c3e50', marginBottom: '8px' },
  formSubtitle: { fontSize: '14px', color: '#7f8c8d', marginBottom: '30px' },
  error: { backgroundColor: '#fde8e8', color: '#e74c3c', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #f5c6cb' },
  success: { backgroundColor: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #c3e6cb' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formRow: { display: 'flex', gap: '16px' },
  inputGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#2c3e50' },
  input: { padding: '12px 14px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', backgroundColor: '#f8f9fc' },
  submitBtn: { padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '5px' },
  loginHint: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#7f8c8d' },
  loginLink: { color: '#667eea', fontWeight: '600', textDecoration: 'none' },
};