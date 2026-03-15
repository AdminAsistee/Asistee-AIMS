import { useState, useRef } from 'react';
import { Plus, MapPin, Upload, ChevronRight, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocations, useCreateLocation, useUploadPhoto } from '../hooks/useLocations';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { useAuthStore } from '../stores/authStore';
import type { Location } from '../types';

const locationSchema = z.object({
  building_name: z.string().min(2, 'Name must be at least 2 characters'),
  room_number: z.number({ coerce: true }).int().min(0),
  address: z.string().min(1, 'Address required'),
  latitude: z.number({ coerce: true }).min(-90).max(90),
  longitude: z.number({ coerce: true }).min(0).max(180),
  owner_id: z.number({ coerce: true }).int().min(1, 'Owner ID required'),
  map_link: z.string().min(1, 'Map link required'),
  entry_info: z.string().min(1, 'Entry info required'),
});
type LocationForm = z.infer<typeof locationSchema>;

function LocationDrawer({ location, onClose }: { location: Location | null; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = useUploadPhoto();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !location) return;
    await upload.mutateAsync({ locationId: location.id, file });
  };

  if (!location) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{location.building_name}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-2 text-sm">
            <p className="text-gray-500"><span className="font-medium text-gray-700">Address:</span> {location.address}</p>
            <p className="text-gray-500"><span className="font-medium text-gray-700">Room:</span> {location.room_number}</p>
            <p className="text-gray-500"><span className="font-medium text-gray-700">Owner:</span> {location.owner?.name ?? `#${location.owner_id}`}</p>
            {location.entry_info && <p className="text-gray-500"><span className="font-medium text-gray-700">Entry:</span> {location.entry_info}</p>}
            {location.map_link && (
              <a href={location.map_link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary-600 hover:underline font-medium">
                <MapPin size={14} /> View on map
              </a>
            )}
          </div>

          {/* Photos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Photos</h3>
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium">
                <Upload size={13} /> Upload
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
            {location.photos?.length ? (
              <div className="grid grid-cols-2 gap-2">
                {location.photos.map(p => (
                  <div key={p.id} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img src={`/storage/${p.thumb_path?.replace('public/', '')}`} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400">No photos uploaded yet.</p>}
          </div>

          {/* Listings */}
          {location.listings && location.listings.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Listings ({location.listings.length})</h3>
              <div className="space-y-1.5">
                {location.listings.map(l => (
                  <div key={l.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <span className="text-gray-700">Listing #{l.id}</span>
                    <span className="text-gray-400">{l.bookings?.length ?? 0} bookings</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Locations() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<Location | null>(null);
  const [apiError, setApiError] = useState('');

  const { data, isLoading } = useLocations(page);
  const create = useCreateLocation();
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
          <button key={loc.id} onClick={() => setSelected(loc)} className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-primary-200 transition-all group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{loc.building_name}</h3>
                </div>
                <p className="text-sm text-gray-500 truncate ml-9">{loc.address}</p>
                <p className="text-xs text-gray-400 mt-1 ml-9">Room {loc.room_number} · {loc.owner?.name ?? 'No owner'}</p>
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

      <LocationDrawer location={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
