import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserCheck, UserX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { useCleanings, useCreateCleaning, useAssignCleaner, useUnassignCleaner, useCleanerUsers } from '../hooks/useCleanings';
import { useLocationOptions } from '../hooks/useLocationOptions';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import { useAuthStore } from '../stores/authStore';
import type { Cleaning } from '../types';

const cleaningSchema = z.object({
  location_id:   z.number().int().min(1, 'Location required'),
  cleaning_date: z.string().min(1, 'Cleaning date required'),
  cleaner_id:    z.string().optional(),   // select sends string; converted in onSubmit
});
type CleaningForm = z.infer<typeof cleaningSchema>;

// ── Assign Cleaner Modal ────────────────────────────────────────────────────
function AssignModal({ cleaning, open, onClose }: { cleaning: Cleaning | null; open: boolean; onClose: () => void }) {
  const { data: cleaners } = useCleanerUsers();
  const assign = useAssignCleaner();
  const [cleanerId, setCleanerId] = useState<number | ''>('');

  const handleAssign = async () => {
    if (!cleaning || !cleanerId) return;
    await assign.mutateAsync({ cleaningId: cleaning.id, cleanerId: cleanerId as number });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Assign Cleaner — Cleaning #${cleaning?.id}`} maxWidth="max-w-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Cleaner</label>
          <select className="input w-full" value={cleanerId} onChange={e => setCleanerId(Number(e.target.value))}>
            <option value="">— select —</option>
            {cleaners?.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleAssign} disabled={!cleanerId || assign.isPending} className="btn-primary">
            {assign.isPending ? 'Assigning…' : 'Assign'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Create Cleaning Form ────────────────────────────────────────────────────
function CreateCleaningForm({
  onSubmit, register, errors, apiError, isSubmitting, onClose,
}: {
  onSubmit: (e: React.FormEvent) => void;
  register: any;
  errors: any;
  apiError: string;
  isSubmitting: boolean;
  onClose: () => void;
}) {
  const { data: locData, isLoading: locLoading } = useLocationOptions();
  const locations = locData?.data ?? [];
  const { data: cleaners } = useCleanerUsers();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Location dropdown */}
      <div>
        <label htmlFor="cleaning-location" className="block text-sm font-medium text-gray-700 mb-1">Property</label>
        <select
          id="cleaning-location"
          {...register('location_id', { valueAsNumber: true })}
          className="input w-full"
          defaultValue=""
        >
          <option value="" disabled>
            {locLoading ? 'Loading…' : '— Select a property —'}
          </option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.building_name} #{loc.room_number}
            </option>
          ))}
        </select>
        {errors.location_id && <p className="text-xs text-red-500 mt-1">{errors.location_id.message}</p>}
      </div>

      {/* Cleaning Date */}
      <div>
        <label htmlFor="cleaning-date" className="block text-sm font-medium text-gray-700 mb-1">Cleaning Date</label>
        <input id="cleaning-date" {...register('cleaning_date')} type="date" className="input w-full" />
        {errors.cleaning_date && <p className="text-xs text-red-500 mt-1">{errors.cleaning_date.message}</p>}
      </div>

      {/* Optional pre-assign cleaner */}
      <div>
        <label htmlFor="cleaning-cleaner" className="block text-sm font-medium text-gray-700 mb-1">
          Assign Cleaner <span className="text-gray-400 font-normal">— optional</span>
        </label>
        <select id="cleaning-cleaner" {...register('cleaner_id')} className="input w-full">
          <option value="">— Unassigned —</option>
          {cleaners?.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {apiError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{apiError}</p>}

      <div className="flex justify-end gap-3 pt-1">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving…' : 'Create Cleaning'}
        </button>
      </div>
    </form>
  );
}

// ── Main Cleanings Page ─────────────────────────────────────────────────────
export default function Cleanings() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignCleaning, setAssignCleaning] = useState<Cleaning | null>(null);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useCleanings(page);
  const create = useCreateCleaning();
  const unassign = useUnassignCleaner();
  const { user } = useAuthStore();
  const isAdmin = user?.type === 'administrator' || user?.type === 'supervisor';

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CleaningForm>({ resolver: zodResolver(cleaningSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setApiError('');
    try {
      const payload: any = {
        location_id:   values.location_id,
        cleaning_date: values.cleaning_date,
      };
      // Only include cleaner_id if a real value was selected
      if (values.cleaner_id && values.cleaner_id !== '') {
        payload.cleaner_id = Number(values.cleaner_id);
      }
      await create.mutateAsync(payload);
      reset();
      setCreateOpen(false);
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Failed to create cleaning.');
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cleanings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.total ?? 0} total cleanings</p>
        </div>
        {isAdmin && (
          <button onClick={() => setCreateOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Cleaning
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                {['#', 'Date', 'Location', 'Cleaner', 'T/F Status', 'Next Booking', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && [...Array(5)].map((_, i) => (
                <tr key={i}>{[...Array(7)].map((_, j) => (
                  <td key={j} className="px-5 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                ))}</tr>
              ))}
              {!isLoading && data?.data?.map(c => (
                <tr key={c.id}
                  onClick={() => navigate(`/cleanings/${c.id}`)}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">{c.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{format(parseISO(c.cleaning_date), 'MMM d, yyyy')}</td>
                  <td className="px-5 py-3 text-gray-700">{c.location?.building_name ?? `#${c.location_id}`}</td>
                  <td className="px-5 py-3 text-gray-700">{c.cleaner?.name ?? <span className="text-gray-400">Unassigned</span>}</td>
                  <td className="px-5 py-3">
                    <Badge variant={c.tf_status ? 'success' : 'default'}>{c.tf_status ? 'TF Day' : 'Normal'}</Badge>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {c.next_booking && typeof c.next_booking === 'object' && 'checkin' in c.next_booking
                      ? format(parseISO((c.next_booking as any).checkin), 'MMM d')
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    {isAdmin && (
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={(e) => { e.stopPropagation(); setAssignCleaning(c); }} title="Assign cleaner"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                          <UserCheck size={15} />
                        </button>
                        {c.cleaner_id && (
                          <button onClick={(e) => { e.stopPropagation(); unassign.mutateAsync(c.id); }} title="Unassign cleaner"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <UserX size={15} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && !data?.data?.length && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">No cleanings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} from={data?.from} to={data?.to} total={data?.total} onPageChange={setPage} />
      </div>

      {/* Create Cleaning Modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setApiError(''); }} title="New Cleaning">
        <CreateCleaningForm
          onSubmit={onSubmit}
          register={register}
          errors={errors}
          apiError={apiError}
          isSubmitting={create.isPending}
          onClose={() => setCreateOpen(false)}
        />
      </Modal>

      <AssignModal cleaning={assignCleaning} open={!!assignCleaning} onClose={() => setAssignCleaning(null)} />
    </div>
  );
}
