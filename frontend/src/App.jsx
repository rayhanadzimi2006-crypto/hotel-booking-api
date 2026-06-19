import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import RoomTypes from './pages/RoomTypes';
import AdminRooms from './pages/AdminRooms';
import CustomerRooms from './pages/CustomerRooms';
import CustomerMyRooms from './pages/CustomerMyRooms';
import AdminBookings from './pages/AdminBookings';
import CustomerBookings from './pages/CustomerBookings';
import Payments from './pages/Payments';

// Route pelanggan & admin
function PrivateRoute({ children }) {
  const role = localStorage.getItem('role');
  if (!role) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

// Route khusus admin (butuh token dari login)
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'admin') return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
        {/* Admin only */}
        <Route path="/customers" element={<AdminRoute><Customers /></AdminRoute>} />
        <Route path="/room-types" element={<AdminRoute><RoomTypes /></AdminRoute>} />
        <Route path="/payments" element={<AdminRoute><Payments /></AdminRoute>} />
        
        {/* Both admin & customer can access, but with different views */}
        <Route path="/rooms" element={<PrivateRoute>
          {localStorage.getItem('role') === 'admin' ? <AdminRooms /> : <CustomerRooms />}
        </PrivateRoute>} />
        <Route path="/my-rooms" element={<PrivateRoute><CustomerMyRooms /></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute>
          {localStorage.getItem('role') === 'admin' ? <AdminBookings /> : <CustomerBookings />}
        </PrivateRoute>} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;