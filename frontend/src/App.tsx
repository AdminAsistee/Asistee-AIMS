import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Cleanings from './pages/Cleanings';
import CleaningDetail from './pages/CleaningDetail';
import Locations from './pages/Locations';
import Supplies from './pages/Supplies';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import CleaningCalendar from './pages/CleaningCalendar';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordResetForm from './pages/PasswordResetForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><PasswordResetRequest /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><PasswordResetForm /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/:id" element={<BookingDetail />} />
            <Route path="cleanings" element={<Cleanings />} />
            <Route path="cleanings/:id" element={<CleaningDetail />} />
            <Route path="locations" element={<Locations />} />
            <Route path="supplies" element={<Supplies />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="cleaning-calendar" element={<CleaningCalendar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
