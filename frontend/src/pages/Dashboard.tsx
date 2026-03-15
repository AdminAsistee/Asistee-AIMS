import { ClipboardList, Calendar, MapPin, Package } from 'lucide-react';
import { useBookings } from '../hooks/useBookings';
import { useCleanings } from '../hooks/useCleanings';
import { useLocations } from '../hooks/useLocations';
import { useSupplies } from '../hooks/useSupplies';
import { format, isAfter, parseISO } from 'date-fns';

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

export default function Dashboard() {
  const { data: bookings } = useBookings(1);
  const { data: cleanings } = useCleanings(1);
  const { data: locations } = useLocations(1);
  const { data: supplies } = useSupplies();

  const upcomingCleanings = cleanings?.data?.filter(c =>
    isAfter(parseISO(c.cleaning_date), new Date())
  ).length ?? '—';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — here's your AIMS overview</p>
      </div>

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

      {/* Recent Bookings Table */}
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
    </div>
  );
}
