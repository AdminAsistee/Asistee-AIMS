import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Save, X, MapPin, CalendarDays, Users, BedDouble, Clock, Link2 } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useBookingDetail, useUpdateBookingDetail } from '../hooks/useBookingDetail';
import { useAuthStore } from '../stores/authStore';
import Badge from '../components/ui/Badge';
import type { Booking } from '../types';

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-36 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900 font-medium flex-1">{value ?? <span className="text-gray-400">—</span>}</span>
    </div>
  );
}

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, error } = useBookingDetail(id!);
  const update = useUpdateBookingDetail();
  const { user } = useAuthStore();
  const isAdmin = user?.type === 'administrator' || user?.type === 'supervisor';

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Booking>>({});
  const [apiError, setApiError] = useState('');

  const startEdit = () => {
    if (!booking) return;
    setForm({
      checkin: booking.checkin?.slice(0, 10) ?? '',
      checkout: booking.checkout?.slice(0, 10) ?? '',
      planned_checkin_time: booking.planned_checkin_time ?? '',
      planned_checkout_time: booking.planned_checkout_time ?? '',
      guests: booking.guests,
      beds: booking.beds,
      status: booking.status ?? '',
    });
    setEditing(true);
    setApiError('');
  };

  const handleSave = async () => {
    if (!booking) return;
    setApiError('');
    try {
      await update.mutateAsync({ id: booking.id, ...form });
      setEditing(false);
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Failed to update booking.');
    }
  };

  const field = (key: keyof Booking) => (
    <input
      className="input w-full h-8 text-sm px-2"
      type={['checkin', 'checkout'].includes(key as string) ? 'date' : ['guests', 'beds'].includes(key as string) ? 'number' : 'time'}
      value={(form[key] as string | number) ?? ''}
      onChange={e => setForm(prev => ({
        ...prev,
        [key]: ['guests', 'beds'].includes(key as string) ? parseInt(e.target.value) : e.target.value,
      }))}
    />
  );

  // Derive location from booking listing
  const location = booking?.listing?.locations?.[0];
  // Find previous_cleaning appended by the backend (it's a computed attribute on location)
  const prevCleaning = (location as any)?.previous_cleaning;

  const nights = booking
    ? differenceInDays(parseISO(booking.checkout), parseISO(booking.checkin))
    : null;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-100 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + i * 5}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">Booking not found.</p>
        <button onClick={() => navigate('/bookings')} className="btn-secondary">← Back to Bookings</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/bookings')} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Booking #{booking.id}</h1>
            {booking.status && (
              <Badge variant={booking.status === 'confirmed' ? 'success' : 'default'}>{booking.status}</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Created {booking.created_at ? format(parseISO(booking.created_at), 'MMM d, yyyy') : '—'}</p>
        </div>
        {!editing ? (
          <button onClick={startEdit} className="btn-secondary flex items-center gap-2">
            <Pencil size={15} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-1.5">
              <X size={15} /> Cancel
            </button>
            <button onClick={handleSave} disabled={update.isPending} className="btn-primary flex items-center gap-1.5">
              <Save size={15} /> {update.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {apiError && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5 mb-4">{apiError}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Stay Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={16} className="text-primary-500" />
            <h2 className="font-semibold text-gray-800">Stay Details</h2>
            {nights !== null && (
              <span className="ml-auto text-xs text-gray-400 bg-gray-50 rounded-full px-2.5 py-0.5">{nights} night{nights !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div>
            <InfoRow label="Check-in" value={editing ? field('checkin') : format(parseISO(booking.checkin), 'EEE, MMM d yyyy')} />
            <InfoRow label="Check-out" value={editing ? field('checkout') : format(parseISO(booking.checkout), 'EEE, MMM d yyyy')} />
            <InfoRow label="Planned check-in" value={editing ? field('planned_checkin_time') : (booking.planned_checkin_time ?? null)} />
            <InfoRow label="Planned check-out" value={editing ? field('planned_checkout_time') : (booking.planned_checkout_time ?? null)} />
            <InfoRow
              label="Guests"
              value={editing ? field('guests') : (
                <span className="flex items-center gap-1.5"><Users size={14} className="text-gray-400" />{booking.guests}</span>
              )}
            />
            <InfoRow
              label="Beds"
              value={editing ? field('beds') : (
                <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-gray-400" />{booking.beds}</span>
              )}
            />
            {isAdmin && (
              <InfoRow
                label="Status"
                value={editing ? (
                  <select
                    className="input h-8 text-sm px-2 w-full"
                    value={(form.status as string) ?? ''}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">— select —</option>
                    {['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                ) : (
                  <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'default'}>
                    {booking.status ?? '—'}
                  </Badge>
                )}
              />
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Guest */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-primary-500" />
              <h2 className="font-semibold text-gray-800">Guest</h2>
            </div>
            {booking.guest ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{booking.guest.name}</p>
                <p className="text-sm text-gray-500">{booking.guest.email}</p>
                {booking.guest.phone && <p className="text-sm text-gray-500">{booking.guest.phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No guest assigned</p>
            )}
          </div>

          {/* Location */}
          {location && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-primary-500" />
                <h2 className="font-semibold text-gray-800">Property</h2>
              </div>
              <div>
                <InfoRow label="Name" value={location.building_name} />
                <InfoRow label="Room" value={`#${location.room_number}`} />
                <InfoRow label="Address" value={location.address} />
                {location.entry_info && <InfoRow label="Entry" value={location.entry_info} />}
                {location.map_link && (
                  <InfoRow label="Map" value={
                    <a href={location.map_link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary-600 hover:underline">
                      <Link2 size={13} /> View on map
                    </a>
                  } />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Linked Cleaning */}
      {prevCleaning && (
        <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-primary-500" />
            <h2 className="font-semibold text-gray-800">Last Cleaning Before Check-in</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {format(parseISO(prevCleaning.cleaning_date), 'EEE, MMM d yyyy')}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {prevCleaning.cleaner ? `Cleaner: ${prevCleaning.cleaner.name}` : 'No cleaner assigned'}
                {prevCleaning.tf_status ? ' · TF Day' : ''}
              </p>
            </div>
            <button
              onClick={() => navigate(`/cleanings/${prevCleaning.id}`)}
              className="btn-secondary text-sm"
            >
              View Cleaning →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
