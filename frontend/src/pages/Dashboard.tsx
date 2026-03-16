import { ClipboardList, Calendar, MapPin, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { useBookings } from '../hooks/useBookings';
import { useCleanings, useAssignMe } from '../hooks/useCleanings';
import { useLocations } from '../hooks/useLocations';
import { useSupplies } from '../hooks/useSupplies';
import { useAuthStore } from '../stores/authStore';
import { format, isAfter, isToday, parseISO } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, sub, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Cleaner: Today's Cleanings widget ───────────────────────────────────────
function TodayCleaningsWidget() {
  const { data } = useCleanings(1);
  const { user } = useAuthStore();

  const myCleanings = data?.data?.filter(c =>
    isToday(parseISO(c.cleaning_date)) && c.cleaner_id === user?.id
  ) ?? [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <CheckCircle size={17} className="text-emerald-500" />
        <h2 className="text-base font-semibold text-gray-900">Today's Cleanings</h2>
        <span className="ml-auto text-xs font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
          {myCleanings.length}
        </span>
      </div>
      {myCleanings.length === 0 ? (
        <p className="px-6 py-8 text-sm text-gray-400 text-center">No cleanings scheduled for today.</p>
      ) : (
        <ul className="divide-y divide-gray-50">
          {myCleanings.map(c => (
            <li key={c.id} className="px-6 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{c.location?.building_name ?? `Location #${c.location_id}`}</p>
                <p className="text-xs text-gray-400">{format(parseISO(c.cleaning_date), 'MMM d, yyyy')}</p>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Assigned</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Cleaner: Unassigned Cleanings widget ────────────────────────────────────
function UnassignedCleaningsWidget() {
  const { data } = useCleanings(1);
  const assignMe = useAssignMe();

  const unassigned = data?.data?.filter(c =>
    !c.cleaner_id && isAfter(parseISO(c.cleaning_date), new Date())
  ) ?? [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <AlertCircle size={17} className="text-amber-500" />
        <h2 className="text-base font-semibold text-gray-900">Unassigned Cleanings</h2>
        <span className="ml-auto text-xs font-medium bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
          {unassigned.length}
        </span>
      </div>
      {unassigned.length === 0 ? (
        <p className="px-6 py-8 text-sm text-gray-400 text-center">No unassigned cleanings — great!</p>
      ) : (
        <ul className="divide-y divide-gray-50">
          {unassigned.slice(0, 6).map(c => (
            <li key={c.id} className="px-6 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{c.location?.building_name ?? `Location #${c.location_id}`}</p>
                <p className="text-xs text-gray-400">{format(parseISO(c.cleaning_date), 'MMM d, yyyy')}</p>
              </div>
              <button
                onClick={() => assignMe.mutateAsync(c.id)}
                disabled={assignMe.isPending}
                className="flex-shrink-0 text-xs font-medium px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {assignMe.isPending ? '…' : 'Assign Me'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { data: bookings }  = useBookings(1);
  const { data: cleanings } = useCleanings(1);
  const { data: locations } = useLocations(1);
  const { data: supplies }  = useSupplies();
  const { user } = useAuthStore();

  const isCleaner = user?.type === 'cleaner';
  const isAdmin   = user?.type === 'administrator' || user?.type === 'supervisor';

  const upcomingCleanings = cleanings?.data?.filter(c =>
    isAfter(parseISO(c.cleaning_date), new Date())
  ).length ?? '—';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — here's your AIMS overview</p>
      </div>

      {/* KPI Stat Cards — hidden for cleaner role */}
      {!isCleaner && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Total Bookings"
            value={bookings?.total ?? '—'}
            sub={`Page 1 of ${bookings?.last_page ?? '?'}`}
            icon={ClipboardList}
            color="bg-blue-500"
          />
          <StatCard
            title="Upcoming Cleanings"
            value={upcomingCleanings}
            sub="from this page"
            icon={Calendar}
            color="bg-emerald-500"
          />
          <StatCard
            title="Locations"
            value={locations?.total ?? '—'}
            sub="registered properties"
            icon={MapPin}
            color="bg-violet-500"
          />
          <StatCard
            title="Supply Items"
            value={supplies?.total ?? '—'}
            sub="tracked items"
            icon={Package}
            color="bg-amber-500"
          />
        </div>
      )}

      {/* Cleaner widgets — only shown for cleaners */}
      {isCleaner && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
          <TodayCleaningsWidget />
          <UnassignedCleaningsWidget />
        </div>
      )}

      {/* Admin/Supervisor: Recent Bookings + Unassigned panel */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Recent Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-in</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-out</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Beds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings?.data?.slice(0, 5).map(b => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 font-medium text-gray-800">{format(parseISO(b.checkin), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-3 text-gray-600">{format(parseISO(b.checkout), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-3 text-gray-600">{b.guests}</td>
                      <td className="px-6 py-3 text-gray-600">{b.beds}</td>
                    </tr>
                  ))}
                  {!bookings?.data?.length && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No bookings yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Unassigned Cleanings (admin view) */}
          <UnassignedCleaningsWidget />
        </div>
      )}

      {/* Default for other roles (client, etc.) */}
      {!isCleaner && !isAdmin && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Beds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings?.data?.slice(0, 5).map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-800">{format(parseISO(b.checkin), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-3 text-gray-600">{format(parseISO(b.checkout), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-3 text-gray-600">{b.guests}</td>
                    <td className="px-6 py-3 text-gray-600">{b.beds}</td>
                  </tr>
                ))}
                {!bookings?.data?.length && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No bookings yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
