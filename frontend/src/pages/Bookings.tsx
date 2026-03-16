import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { useBookings, useCreateBooking, useUpdateBooking, useDeleteBooking } from '../hooks/useBookings';
import { useLocationOptions } from '../hooks/useLocationOptions';
import { useClientOptions } from '../hooks/useClientOptions';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import type { Booking } from '../types';

const bookingSchema = z.object({
  listing_id: z.number().int().min(1, 'Please select a property'),
  checkin:    z.string().min(1, 'Check-in required'),
  checkout:   z.string().min(1, 'Check-out required'),
  guests:     z.number().int().min(1).max(1000),
  beds:       z.number().int().min(0).optional(),
  guest_id:   z.string().optional(),   // select sends string; converted in handleCreate
});
type BookingForm = z.infer<typeof bookingSchema>;

function BookingFormFields({ register, errors, setValue }: { register: any; errors: any; setValue: any }) {
  const { data: locData, isLoading: locLoading } = useLocationOptions();
  const { data: clients, isLoading: clientsLoading } = useClientOptions();
  const locations = locData?.data ?? [];

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locId = parseInt(e.target.value);
    const loc = locations.find(l => l.id === locId);
    const listingId = loc?.listings?.[0]?.id ?? 0;
    setValue('listing_id', listingId, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="location_select" className="block text-sm font-medium text-gray-700 mb-1">Property</label>
        <select id="location_select" onChange={handleLocationChange} className="input w-full" defaultValue="">
          <option value="" disabled>
            {locLoading ? 'Loading properties…' : '— Select a property —'}
          </option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.building_name} #{loc.room_number}
              {(!loc.listings || loc.listings.length === 0) ? ' (no listing)' : ''}
            </option>
          ))}
        </select>
        <input type="hidden" {...register('listing_id', { valueAsNumber: true })} />
        {errors.listing_id && <p className="text-xs text-red-500 mt-1">{errors.listing_id.message}</p>}
      </div>

      {/* Guest (client) dropdown */}
      <div>
        <label htmlFor="guest_id" className="block text-sm font-medium text-gray-700 mb-1">Guest (Client) <span className="text-gray-400 font-normal">— optional</span></label>
        <select id="guest_id" {...register('guest_id')} className="input w-full">
          <option value="">— Unassigned —</option>
          {!clientsLoading && clients?.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="checkin" className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
          <input id="checkin" {...register('checkin')} type="date" className="input w-full" />
          {errors.checkin && <p className="text-xs text-red-500 mt-1">{errors.checkin.message}</p>}
        </div>
        <div>
          <label htmlFor="checkout" className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
          <input id="checkout" {...register('checkout')} type="date" className="input w-full" />
          {errors.checkout && <p className="text-xs text-red-500 mt-1">{errors.checkout.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
          <input id="guests" {...register('guests', { valueAsNumber: true })} type="number" min={1} className="input w-full" />
          {errors.guests && <p className="text-xs text-red-500 mt-1">{errors.guests.message}</p>}
        </div>
        <div>
          <label htmlFor="beds" className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
          <input id="beds" {...register('beds', { valueAsNumber: true })} type="number" min={0} className="input w-full" />
        </div>
      </div>
    </div>
  );
}


export default function Bookings() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useBookings(page);
  const createMutation = useCreateBooking();
  const updateMutation = useUpdateBooking();
  const deleteMutation = useDeleteBooking();

  const createForm = useForm<BookingForm>({ resolver: zodResolver(bookingSchema) });
  const editForm   = useForm<BookingForm>({ resolver: zodResolver(bookingSchema) });

  const openEdit = (b: Booking) => {
    setEditBooking(b);
    editForm.reset({
      listing_id: b.listing_id,
      checkin: b.checkin.slice(0, 10),
      checkout: b.checkout.slice(0, 10),
      guests: b.guests,
      beds: b.beds,
    });
  };

  const handleCreate = createForm.handleSubmit(async (values) => {
    setApiError('');
    try {
      const payload: any = {
        listing_id: values.listing_id,
        checkin:    values.checkin,
        checkout:   values.checkout,
        guests:     values.guests,
        beds:       values.beds,
      };
      // Only include guest_id if a real client was selected
      if (values.guest_id && values.guest_id !== '') {
        payload.guest_id = Number(values.guest_id);
      }
      await createMutation.mutateAsync(payload);
      createForm.reset();
      setCreateOpen(false);
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Failed to create booking.');
    }
  });

  const handleEdit = editForm.handleSubmit(async (values) => {
    if (!editBooking) return;
    setApiError('');
    try {
      const payload: any = {
        listing_id: values.listing_id,
        checkin:    values.checkin,
        checkout:   values.checkout,
        guests:     values.guests,
        beds:       values.beds,
      };
      if (values.guest_id && values.guest_id !== '') {
        payload.guest_id = Number(values.guest_id);
      }
      await updateMutation.mutateAsync({ id: editBooking.id, ...payload });
      setEditBooking(null);
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Failed to update booking.');
    }
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.total ?? 0} total bookings</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Booking
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                {['#', 'Listing', 'Check-in', 'Check-out', 'Guests', 'Beds', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              )}
              {!isLoading && data?.data?.map(b => (
                <tr key={b.id}
                  onClick={() => navigate(`/bookings/${b.id}`)}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">{b.id}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium">#{b.listing_id}</td>
                  <td className="px-5 py-3 text-gray-700">{format(parseISO(b.checkin), 'MMM d, yyyy')}</td>
                  <td className="px-5 py-3 text-gray-700">{format(parseISO(b.checkout), 'MMM d, yyyy')}</td>
                  <td className="px-5 py-3 text-gray-700">{b.guests}</td>
                  <td className="px-5 py-3 text-gray-700">{b.beds}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(b); }} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteId(b.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && !data?.data?.length && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} from={data?.from} to={data?.to} total={data?.total} onPageChange={setPage} />
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setApiError(''); }} title="New Booking">
        <form onSubmit={handleCreate} className="space-y-5">
          <BookingFormFields register={createForm.register} errors={createForm.formState.errors} setValue={createForm.setValue} />
          {apiError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{apiError}</p>}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => setCreateOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="btn-primary">
              {createMutation.isPending ? 'Saving…' : 'Create Booking'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editBooking} onClose={() => { setEditBooking(null); setApiError(''); }} title={`Edit Booking #${editBooking?.id}`}>
        <form onSubmit={handleEdit} className="space-y-5">
          <BookingFormFields register={editForm.register} errors={editForm.formState.errors} setValue={editForm.setValue} />
          {apiError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{apiError}</p>}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => setEditBooking(null)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={updateMutation.isPending} className="btn-primary">
              {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Booking"
        message={`Delete booking #${deleteId}? This cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
