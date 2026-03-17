import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Upload, ChevronRight, X, Trash2, Link2, RefreshCw, Wifi, ChevronLeft, ZoomIn, CheckCircle, AlertTriangle } from 'lucide-react';
import { getPhotoUrl } from '../lib/photoUrl';
import { useCreateChannelAccount, useSyncListing } from '../hooks/useChannelAccounts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, parseISO, isWithinInterval, isSameDay } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocations, useLocationDetail, useCreateLocation, useUploadPhoto, useUpdateLocation, useDeleteLocation, useDeletePhoto } from '../hooks/useLocations';
import { useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import { useAuthStore } from '../stores/authStore';
import type { Location, Listing } from '../types';

const locationSchema = z.object({
  building_name:              z.string().min(2, 'Name must be at least 2 characters'),
  room_number:                z.number().int().min(0),
  address:                    z.string().min(1, 'Address required'),
  latitude:                   z.number().min(-90).max(90),
  longitude:                  z.number().min(0).max(180),
  owner_id:                   z.number().int().min(1, 'Owner ID required'),
  map_link:                   z.string().min(1, 'Map link required'),
  entry_info:                 z.string().min(1, 'Entry info required'),
  mail_rules:                 z.string().optional(),
  trash_rules:                z.string().optional(),
  guest_photo_directions_link: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
});

type LocationForm = z.infer<typeof locationSchema>;
type DrawerTab = 'info' | 'photos' | 'listings' | 'calendar';

const CHANNEL_LABELS: Record<string, string> = {
  manual:      'Manual',
  airbnb:      'Airbnb',
  booking_com: 'Booking.com',
  vrbo:        'VRBO',
};

const CHANNEL_COLORS: Record<string, string> = {
  manual:      'bg-gray-100 text-gray-600',
  airbnb:      'bg-pink-100 text-pink-700',
  booking_com: 'bg-blue-100 text-blue-700',
  vrbo:        'bg-indigo-100 text-indigo-700',
};

function ListingStatusBadge({ status }: { status?: string }) {
  const s = status ?? 'inactive';
  const colors: Record<string, string> = {
    active:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-gray-50 text-gray-500 border-gray-200',
    pending:  'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[s] ?? colors.inactive}`}>
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}

function ListingsTab({ listings, isAdmin, selectedLocationId }: { listings: Listing[]; isAdmin: boolean; selectedLocationId: number | null }) {
  const queryClient = useQueryClient();
  // Per-listing state: sync results and iCal URL form
  const [syncResults, setSyncResults] = useState<Record<number, string>>({});
  const [syncing, setSyncing] = useState<Record<number, boolean>>({});
  const [icalForms, setIcalForms] = useState<Record<number, { open: boolean; url: string }>>({});
  const [icalSaving, setIcalSaving] = useState<Record<number, boolean>>({});
  const [icalDeletePrompt, setIcalDeletePrompt] = useState<number | null>(null); // listingId pending delete
  const createAccount = useCreateChannelAccount();
  const syncListing = useSyncListing();

  async function handleSync(listingId: number) {
    setSyncing((s) => ({ ...s, [listingId]: true }));
    setSyncResults((r) => ({ ...r, [listingId]: '' }));
    try {
      const res = await syncListing.mutateAsync(listingId);
      if (res.error) {
        setSyncResults((r) => ({ ...r, [listingId]: `⚠️ ${res.error}` }));
      } else {
        setSyncResults((r) => ({
          ...r,
          [listingId]: `✅ ${res.created_bookings} new booking(s), ${res.created_cleanings} new cleaning(s)`,
        }));
      }
    } catch {
      setSyncResults((r) => ({ ...r, [listingId]: '⚠️ Sync failed — check backend logs.' }));
    } finally {
      setSyncing((s) => ({ ...s, [listingId]: false }));
    }
  }

  async function handleAddIcal(listingId: number) {
    const url = icalForms[listingId]?.url ?? '';
    if (!url) return;
    setIcalSaving((s) => ({ ...s, [listingId]: true }));
    try {
      const newAccount = await createAccount.mutateAsync({
        description: `iCal — Listing #${listingId}`,
        channel_id: 2,
        authentication_token: url,
      });
      // Link the new channel account to this listing
      await api.patch(`/api/v1/listings/${listingId}`, {
        channel_account_id: newAccount.id,
      });
      // Refresh the location detail so Sync Now button appears
      queryClient.invalidateQueries({ queryKey: ['locations', 'detail', selectedLocationId] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIcalForms((f) => ({ ...f, [listingId]: { open: false, url: '' } }));
      setSyncResults((r) => ({ ...r, [listingId]: '✅ iCal connected! Click Sync Now to import bookings.' }));
    } catch {
      setSyncResults((r) => ({ ...r, [listingId]: '⚠️ Failed to save iCal URL.' }));
    } finally {
      setIcalSaving((s) => ({ ...s, [listingId]: false }));
    }
  }

  if (!listings.length) {
    return (
      <div className="text-center py-10 text-gray-400">
        <Wifi size={32} className="mx-auto mb-2 opacity-30" />
        <p className="text-sm">No listings linked to this location yet.</p>
        {isAdmin && (
          <p className="text-xs mt-1 text-gray-400">Listings are created automatically when connecting an OTA.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {listings.map((listing) => {
        const channel = (listing as any).channel_account?.channel ?? 'manual';
        const channelAccountId = listing.channel_account_id;
        const hasIcal = channelAccountId != null && (listing.channel_account as any)?.channel_id === 2;
        const channelLabel = CHANNEL_LABELS[channel] ?? (channelAccountId ? 'OTA' : 'Manual');
        const channelColor = CHANNEL_COLORS[channel] ?? CHANNEL_COLORS.manual;
        const syncResult = syncResults[listing.id];
        const isIcalFormOpen = icalForms[listing.id]?.open ?? false;

        return (
          <div key={listing.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">
                  {(listing as any).listing_title ?? `Listing #${listing.id}`}
                </p>
                {(listing as any).channel_listing_id && (
                  <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">
                    ID: {(listing as any).channel_listing_id}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${channelColor}`}>
                  {channelLabel}
                </span>
                <ListingStatusBadge status={(listing as any).status} />
              </div>
            </div>

            {/* Booking count */}
            <p className="text-xs text-gray-400 mb-1">
              {listing.bookings?.length ?? 0} booking{(listing.bookings?.length ?? 0) !== 1 ? 's' : ''} linked
            </p>

            {/* iCal URL display */}
            {hasIcal && (listing.channel_account as any)?.ical_url && (
              <div className="flex items-center gap-1.5 mb-3 group">
                <Wifi size={11} className="text-indigo-400 flex-shrink-0" />
                <p className="text-xs text-indigo-500 font-mono truncate flex-1" title={(listing.channel_account as any).ical_url}>
                  {(listing.channel_account as any).ical_url}
                </p>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                  title="Remove iCal URL"
                  onClick={() => setIcalDeletePrompt(listing.id)}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            )}

            {/* iCal delete confirmation — two-choice inline panel */}
            {icalDeletePrompt === listing.id && (
              <div className="mb-3 border border-red-100 rounded-xl bg-red-50 px-3 py-2.5">
                <p className="text-xs font-medium text-red-700 mb-2">Also delete bookings synced from this iCal?</p>
                <p className="text-xs text-red-500 mb-3">Manually created bookings will always be kept.</p>
                <div className="flex gap-2">
                  <button
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors"
                    onClick={async () => {
                      await api.patch(`/api/v1/listings/${listing.id}`, { channel_account_id: null, delete_bookings: true });
                      queryClient.invalidateQueries({ queryKey: ['locations', 'detail', selectedLocationId] });
                      queryClient.invalidateQueries({ queryKey: ['locations'] });
                      queryClient.invalidateQueries({ queryKey: ['bookings'] });
                      setSyncResults((r) => ({ ...r, [listing.id]: '' }));
                      setIcalDeletePrompt(null);
                    }}
                  >Yes, delete iCal bookings</button>
                  <button
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    onClick={async () => {
                      await api.patch(`/api/v1/listings/${listing.id}`, { channel_account_id: null, delete_bookings: false });
                      queryClient.invalidateQueries({ queryKey: ['locations', 'detail', selectedLocationId] });
                      queryClient.invalidateQueries({ queryKey: ['locations'] });
                      setSyncResults((r) => ({ ...r, [listing.id]: '' }));
                      setIcalDeletePrompt(null);
                    }}
                  >No, keep bookings</button>
                </div>
              </div>
            )}

            {/* Sync result toast */}
            {syncResult && (
              <div className={`text-xs rounded-lg px-3 py-2 mb-2 flex items-center gap-1.5 ${
                syncResult.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {syncResult.startsWith('✅')
                  ? <CheckCircle size={12} />
                  : <AlertTriangle size={12} />}
                {syncResult.replace(/^[✅⚠️]\s*/, '')}
              </div>
            )}

            {/* iCal URL inline form */}
            {isIcalFormOpen && (
              <div className="mb-3 flex gap-2">
                <input
                  type="url"
                  className="flex-1 border rounded-lg px-3 py-1.5 text-xs font-mono focus:ring-2 focus:ring-indigo-300 outline-none"
                  placeholder="https://www.airbnb.com/calendar/ical/…"
                  value={icalForms[listing.id]?.url ?? ''}
                  onChange={(e) => setIcalForms((f) => ({ ...f, [listing.id]: { open: true, url: e.target.value } }))}
                />
                <button
                  onClick={() => handleAddIcal(listing.id)}
                  disabled={icalSaving[listing.id]}
                  className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-medium"
                >
                  {icalSaving[listing.id] ? '…' : 'Save'}
                </button>
                <button
                  onClick={() => setIcalForms((f) => ({ ...f, [listing.id]: { open: false, url: '' } }))}
                  className="text-xs px-2 py-1.5 rounded-lg border text-gray-500 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Action buttons */}
            {isAdmin && (
              <div className="flex gap-2 flex-wrap">
                {hasIcal ? (
                  // iCal listing — show Sync Now
                  <button
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors font-medium disabled:opacity-50"
                    title="Sync bookings and cleanings from this iCal listing"
                    onClick={() => handleSync(listing.id)}
                    disabled={syncing[listing.id]}
                  >
                    <RefreshCw size={12} className={syncing[listing.id] ? 'animate-spin' : ''} />
                    {syncing[listing.id] ? 'Syncing…' : 'Sync Now'}
                  </button>
                ) : (
                  // Manual listing — no OTA linked yet, use Add iCal URL instead
                  <button
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed font-medium"
                    title="Use 'Add iCal URL' below to connect an iCal feed, or contact support for full OTA API integration"
                    disabled
                  >
                    <Link2 size={12} /> Connect OTA
                  </button>
                )}
                {/* Always show Add iCal URL for any listing */}
                <button
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors font-medium"
                  title="Add or update iCal URL for this listing"
                  onClick={() => setIcalForms((f) => ({ ...f, [listing.id]: { open: !isIcalFormOpen, url: '' } }))}
                >
                  <Wifi size={12} /> {isIcalFormOpen ? 'Cancel iCal' : 'Add iCal URL'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} // end ListingsTab

// ─── LocationCalendarTab ─────────────────────────────────────────────────────
function LocationCalendarTab({ location }: { location: Location }) {
  const navigate = useNavigate();
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // Gather all bookings from all listings
  const allBookings = useMemo(() => {
    return (location.listings ?? []).flatMap(l => (l as any).bookings ?? []);
  }, [location.listings]);

  // Gather all cleanings
  const allCleanings = useMemo(() => {
    return (location as any).cleanings ?? [];
  }, [location]);

  const monthStart = startOfMonth(current);
  const monthEnd   = endOfMonth(current);
  const gridStart  = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd    = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days       = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const prevMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={15} />
        </button>
        <span className="text-sm font-semibold text-gray-800">{format(current, 'MMMM yyyy')}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Grid header */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((d, i) => (
          <div key={i} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, current);
          const isDayToday     = isToday(day);

          // Bookings that span this day
          const bookingsOnDay = allBookings.filter((b: any) => {
            if (!b.checkin || !b.checkout) return false;
            try {
              return isWithinInterval(day, {
                start: parseISO(b.checkin),
                end:   parseISO(b.checkout),
              });
            } catch { return false; }
          });

          // Cleanings on this exact day
          const cleaningsOnDay = allCleanings.filter((c: any) => {
            if (!c.cleaning_date) return false;
            try { return isSameDay(day, parseISO(c.cleaning_date.slice(0, 10))); }
            catch { return false; }
          });

          const hasBooking  = bookingsOnDay.length > 0;
          void hasBooking; // used for JSX readability check — booking bar rendered directly
          const hasCleaning = cleaningsOnDay.length > 0;

          return (
            <div
              key={idx}
              className={`min-h-[52px] rounded p-0.5 ${
                !isCurrentMonth ? 'opacity-30' : ''
              }`}
            >
              {/* Day number */}
              <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-0.5 ${
                isDayToday
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700'
              }`}>
                {format(day, 'd')}
              </div>

              {/* Booking spans */}
              {bookingsOnDay.slice(0, 2).map((b: any, bi: number) => (
                <button
                  key={`b-${bi}`}
                  onClick={() => navigate(`/bookings/${b.id}`)}
                  className="w-full text-left text-[10px] leading-tight px-1 py-0.5 mb-0.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors truncate block"
                  title={`Booking #${b.id}: ${b.checkin?.slice(0,10)} → ${b.checkout?.slice(0,10)}`}
                >
                  #{b.id}
                </button>
              ))}

              {/* Cleaning dots */}
              {hasCleaning && (
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                  {cleaningsOnDay.slice(0, 3).map((c: any, ci: number) => (
                    <button
                      key={`c-${ci}`}
                      onClick={() => navigate(`/cleanings/${c.id}`)}
                      className="flex items-center gap-0.5 text-[10px] leading-tight px-1 py-0.5 rounded bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors"
                      title={`Cleaning #${c.id}${
                        c.cleaner ? ` — ${c.cleaner.name}` : ''
                      }${c.tf_status ? ' (TF)' : ''}`}
                    >
                      🧹{c.tf_status ? '🔄' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
          <span className="text-xs text-gray-500">Booking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🧹</span>
          <span className="text-xs text-gray-500">Cleaning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🔄</span>
          <span className="text-xs text-gray-500">TF Day</span>
        </div>
      </div>

      {/* Totals */}
      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        <span>{allBookings.length} total booking{allBookings.length !== 1 ? 's' : ''}</span>
        <span>{allCleanings.length} total cleaning{allCleanings.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}

function LocationDrawer({
  location, onClose, onDelete, onUpdate, isAdmin, loading,
}: {
  location: Location | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onUpdate: (loc?: Location) => void;
  isAdmin: boolean;
  loading?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = useUploadPhoto();
  const deletePhoto = useDeletePhoto();
  const updateLocation = useUpdateLocation();
  const [deleteError, setDeleteError] = useState('');
  const [activeTab, setActiveTab] = useState<DrawerTab>('info');
  const [editing, setEditing] = useState(false);
  const [editVals, setEditVals] = useState<Partial<Location>>({});
  const [editError, setEditError] = useState('');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const startEdit = () => {
    setEditVals({
      building_name: location?.building_name ?? '',
      room_number: location?.room_number ?? 0,
      address: location?.address ?? '',
      map_link: location?.map_link ?? '',
      entry_info: location?.entry_info ?? '',
      mail_rules: (location as any)?.mail_rules ?? '',
      trash_rules: (location as any)?.trash_rules ?? '',
      guest_photo_directions_link: (location as any)?.guest_photo_directions_link ?? '',
    });
    setEditError('');
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!location) return;
    setEditError('');
    try {
      const updated = await updateLocation.mutateAsync({ id: location.id, ...editVals });
      onUpdate(updated);
      setEditing(false);
    } catch (e: any) {
      setEditError(e?.response?.data?.message ?? 'Failed to save changes.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !location) return;
    let updated: Location | null = null;
    for (const file of Array.from(files)) {
      updated = await upload.mutateAsync({ locationId: location.id, file });
    }
    if (updated) onUpdate(updated);
    e.target.value = '';
  };

  if (!location) return null;

  const listings: Listing[] = (location as any).listings ?? [];

  const tabs: { id: DrawerTab; label: string; count?: number }[] = [
    { id: 'info',     label: 'Info' },
    { id: 'photos',   label: 'Photos',   count: location.photos?.length },
    { id: 'listings', label: 'Listings', count: listings.length },
    { id: 'calendar', label: 'Calendar' },
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 truncate pr-2">{location.building_name}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 mr-5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
            </div>
          )}

          {/* INFO TAB */}
          {!loading && activeTab === 'info' && (
            <div className="space-y-4">
              {/* View mode */}
              {!editing && (
                <>
                  {isAdmin && (
                    <div className="flex justify-end">
                      <button onClick={startEdit} className="text-xs text-primary-600 hover:underline font-medium">✏️ Edit Info</button>
                    </div>
                  )}
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-500"><span className="font-medium text-gray-700">Address:</span> {location.address}</p>
                    <p className="text-gray-500"><span className="font-medium text-gray-700">Room:</span> {location.room_number}</p>
                    {location.max_beds && <p className="text-gray-500"><span className="font-medium text-gray-700">Max Beds:</span> {location.max_beds}</p>}
                    <p className="text-gray-500"><span className="font-medium text-gray-700">Owner:</span> {location.owner?.name ?? `#${location.owner_id}`}</p>
                    {location.entry_info && (
                      <p className="text-gray-500"><span className="font-medium text-gray-700">Entry:</span> {location.entry_info}</p>
                    )}
                    {location.mail_rules && (
                      <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs">
                        <span className="font-medium text-blue-700">📬 Mail Rules:</span>
                        <p className="text-blue-600 mt-0.5">{location.mail_rules}</p>
                      </div>
                    )}
                    {location.trash_rules && (
                      <div className="bg-green-50 rounded-lg px-3 py-2 text-xs">
                        <span className="font-medium text-green-700">🗑️ Trash Rules:</span>
                        <p className="text-green-600 mt-0.5">{location.trash_rules}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {location.map_link && (
                      <a href={location.map_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary-600 hover:underline font-medium text-sm">
                        <MapPin size={14} /> View on Map
                      </a>
                    )}
                    {location.guest_photo_directions_link && (
                      <a href={location.guest_photo_directions_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-purple-600 hover:underline font-medium text-sm">
                        📷 Photo Directions
                      </a>
                    )}
                  </div>
                </>
              )}

              {/* Edit mode */}
              {editing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-700">Edit Location Info</p>
                    <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-gray-600">✕ Cancel</button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Building Name</label>
                    <input className="input w-full text-sm" value={editVals.building_name ?? ''} onChange={e => setEditVals(v => ({ ...v, building_name: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Room #</label>
                      <input type="number" min={0} className="input w-full text-sm" value={editVals.room_number ?? ''} onChange={e => setEditVals(v => ({ ...v, room_number: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Max Beds</label>
                      <input type="number" min={0} className="input w-full text-sm" value={(editVals as any).max_beds ?? ''} onChange={e => setEditVals(v => ({ ...v, max_beds: Number(e.target.value) || undefined } as any))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                    <input className="input w-full text-sm" value={editVals.address ?? ''} onChange={e => setEditVals(v => ({ ...v, address: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Google Maps Link</label>
                    <input className="input w-full text-sm" value={editVals.map_link ?? ''} onChange={e => setEditVals(v => ({ ...v, map_link: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Entry Info</label>
                    <textarea rows={2} className="input w-full text-sm resize-none" value={editVals.entry_info ?? ''} onChange={e => setEditVals(v => ({ ...v, entry_info: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">📬 Mail Rules</label>
                    <textarea rows={2} className="input w-full text-sm resize-none" value={(editVals as any).mail_rules ?? ''} onChange={e => setEditVals(v => ({ ...v, mail_rules: e.target.value } as any))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">🗑️ Trash Rules</label>
                    <textarea rows={2} className="input w-full text-sm resize-none" value={(editVals as any).trash_rules ?? ''} onChange={e => setEditVals(v => ({ ...v, trash_rules: e.target.value } as any))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">📷 Guest Photo Directions Link</label>
                    <input className="input w-full text-sm" value={(editVals as any).guest_photo_directions_link ?? ''} onChange={e => setEditVals(v => ({ ...v, guest_photo_directions_link: e.target.value } as any))} />
                  </div>
                  {editError && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{editError}</p>}
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveEdit} disabled={updateLocation.isPending} className="btn-primary text-sm flex-1">
                      {updateLocation.isPending ? 'Saving…' : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </div>
              )}


              {/* Delete — admin only */}
              {isAdmin && (
                <div className="pt-4 border-t border-gray-100">
                  {deleteError && (
                    <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{deleteError}</p>
                  )}
                  <button
                    onClick={() => { setDeleteError(''); onDelete(location.id); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} /> Delete Location
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-2">Blocked if upcoming bookings exist</p>
                </div>
              )}
            </div>
          )}

          {/* PHOTOS TAB */}
          {!loading && activeTab === 'photos' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Property Photos</h3>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Upload size={13} /> Upload Photo
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
              </div>
              {location.photos?.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {location.photos.map(p => {
                    const url = getPhotoUrl(p.full_path ?? p.thumb_path);
                    return (
                      <div key={p.id} className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group">
                        {/* Clickable image → lightbox */}
                        <button
                          className="w-full h-full"
                          onClick={() => setLightboxUrl(url)}
                          title="Click to enlarge"
                        >
                          <img
                            src={url}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:brightness-90 transition"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          {/* Zoom hint */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                            <ZoomIn size={20} className="text-white drop-shadow" />
                          </div>
                        </button>
                        {/* Delete button — admin only */}
                        {isAdmin && (
                          <button
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                            title="Delete photo"
                            onClick={e => { e.stopPropagation(); deletePhoto.mutate(p.id); }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <Upload size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No photos uploaded yet.</p>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="mt-2 text-xs text-primary-600 hover:underline"
                  >
                    Upload the first photo
                  </button>
                </div>
              )}

              {/* Lightbox */}
              {lightboxUrl && (
                <div
                  className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                  onClick={() => setLightboxUrl(null)}
                >
                  <button
                    className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                    onClick={() => setLightboxUrl(null)}
                  >
                    <X size={24} />
                  </button>
                  <img
                    src={lightboxUrl}
                    alt="Full size"
                    className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
          )}

          {/* LISTINGS TAB */}
          {!loading && activeTab === 'listings' && (
            <ListingsTab listings={listings} isAdmin={isAdmin} selectedLocationId={location.id} />
          )}

          {/* CALENDAR TAB */}
          {!loading && activeTab === 'calendar' && (
            <LocationCalendarTab location={location} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Locations() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [apiError, setApiError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useLocations(page);
  const { data: selectedLocation, isLoading: detailLoading } = useLocationDetail(selectedId);
  const create = useCreateLocation();
  const deleteMutation = useDeleteLocation();
  const { user } = useAuthStore();
  const isAdmin = user?.type === 'administrator' || user?.type === 'supervisor';

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LocationForm>({ resolver: zodResolver(locationSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setApiError('');
    try {
      await create.mutateAsync(values);
      reset();
      setCreateOpen(false);
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Failed to create location.');
    }
  });

  const handleDelete = async (id: number) => {
    setDeleteError('');
    try {
      await deleteMutation.mutateAsync(id);
      setSelectedId(null);
      setConfirmDeleteId(null);
    } catch (e: any) {
      setDeleteError(e?.response?.data?.message ?? 'Failed to delete location.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.total ?? 0} registered properties</p>
        </div>
        {isAdmin && (
          <button onClick={() => setCreateOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Location
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading && [...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
            <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-full mb-1" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
        {!isLoading && data?.data?.map(loc => (
          <button key={loc.id} onClick={() => setSelectedId(loc.id)} className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-primary-200 transition-all group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{loc.building_name}</h3>
                </div>
                <p className="text-sm text-gray-500 truncate ml-9">{loc.address}</p>
                <p className="text-xs text-gray-400 mt-1 ml-9">
                  Room {loc.room_number} · {loc.owner?.name ?? 'No owner'}
                  {(loc as any).listings?.length > 0 && (
                    <span className="ml-1 text-primary-400">· {(loc as any).listings.length} listing{(loc as any).listings.length !== 1 ? 's' : ''}</span>
                  )}
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-400 transition-colors mt-1 flex-shrink-0" />
            </div>
          </button>
        ))}
        {!isLoading && !data?.data?.length && (
          <div className="col-span-3 text-center py-16 text-gray-400">No locations found.</div>
        )}
      </div>

      {data && data.last_page > 1 && (
        <div className="mt-4 bg-white rounded-2xl border border-gray-100">
          <Pagination currentPage={data.current_page} lastPage={data.last_page} from={data.from} to={data.to} total={data.total} onPageChange={setPage} />
        </div>
      )}

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setApiError(''); }} title="New Location" maxWidth="max-w-xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Building Name</label>
              <input {...register('building_name')} className="input w-full" placeholder="e.g. Sakura Residence" />
              {errors.building_name && <p className="text-xs text-red-500 mt-1">{errors.building_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input {...register('room_number', { valueAsNumber: true })} type="number" min={0} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner ID</label>
              <input {...register('owner_id', { valueAsNumber: true })} type="number" min={1} className="input w-full" />
              {errors.owner_id && <p className="text-xs text-red-500 mt-1">{errors.owner_id.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input {...register('address')} className="input w-full" placeholder="Full address" />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input {...register('latitude', { valueAsNumber: true })} type="number" step="any" className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input {...register('longitude', { valueAsNumber: true })} type="number" step="any" className="input w-full" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
              <input {...register('map_link')} className="input w-full" placeholder="https://maps.google.com/..." />
              {errors.map_link && <p className="text-xs text-red-500 mt-1">{errors.map_link.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Entry Info</label>
              <textarea {...register('entry_info')} rows={2} className="input w-full resize-none" placeholder="Key box code, door access instructions..." />
              {errors.entry_info && <p className="text-xs text-red-500 mt-1">{errors.entry_info.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">📬 Mail Rules <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea {...register('mail_rules')} rows={2} className="input w-full resize-none" placeholder="e.g. Check the blue mailbox daily. Forward packages to owner." />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">🗑️ Trash Rules <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea {...register('trash_rules')} rows={2} className="input w-full resize-none" placeholder="e.g. Burnable trash: Mon/Thu. Recyclables: 1st/3rd Sat." />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">📷 Guest Photo Directions Link <span className="text-gray-400 font-normal">(optional)</span></label>
              <input {...register('guest_photo_directions_link')} className="input w-full" placeholder="https://drive.google.com/..." />
              {errors.guest_photo_directions_link && <p className="text-xs text-red-500 mt-1">{errors.guest_photo_directions_link.message}</p>}
            </div>
          </div>
          {apiError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{apiError}</p>}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => setCreateOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={create.isPending} className="btn-primary">
              {create.isPending ? 'Saving…' : 'Create Location'}
            </button>
          </div>
        </form>
      </Modal>

      {selectedId !== null && (
        <LocationDrawer
          location={detailLoading ? null : (selectedLocation ?? null)}
          onClose={() => { setSelectedId(null); setDeleteError(''); }}
          onDelete={(id) => setConfirmDeleteId(id)}
          onUpdate={() => { /* detail query auto-refetches on mutation invalidation */ }}
          isAdmin={isAdmin}
          loading={detailLoading}
        />
      )}

      <ConfirmDialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        title="Delete Location"
        message={
          deleteError
            ? deleteError
            : `Delete this location? This cannot be undone. Blocked if upcoming bookings exist.`
        }
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
