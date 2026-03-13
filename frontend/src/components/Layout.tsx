import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  Home, Calendar, ClipboardList, MapPin, Package, Users, User, LogOut
} from 'lucide-react';
import { clsx } from 'clsx';

const nav = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/bookings', label: 'Bookings', icon: ClipboardList },
  { to: '/cleanings', label: 'Cleanings', icon: Calendar },
  { to: '/locations', label: 'Locations', icon: MapPin },
  { to: '/supplies', label: 'Supplies', icon: Package },
  { to: '/users', label: 'Users', icon: Users, adminOnly: true },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();
  const isAdmin = user?.type === 'administrator' || user?.type === 'supervisor';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-600">Asistee AIMS</h1>
          <p className="text-xs text-gray-500 mt-1">{user?.name}</p>
          <span className="badge bg-primary-50 text-primary-700 mt-1">{user?.type}</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label, icon: Icon, adminOnly }) => {
            if (adminOnly && !isAdmin) return null;
            const active = pathname === to || (to !== '/' && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
