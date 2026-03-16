import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, UserX, MapPin, CalendarDays, Package, CheckCircle2, Truck, Plus, Clock, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getPhotoUrl } from '../lib/photoUrl';
import { useCleaningDetail, useUpdateCleaningDetail } from '../hooks/useCleaningDetail';
import { useAssignCleaner, useUnassignCleaner, useAssignMe, useCleanerUsers } from '../hooks/useCleanings';
import { useSupplyTransactions, useCreateSupplyTransaction, useFulfillTransaction, useDeliverTransaction } from '../hooks/useSupplyTransactions';
import { useSupplies } from '../hooks/useSupplies';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useAuthStore } from '../stores/authStore';
import type { SupplyTransaction } from '../types';

function TxStatusBadge({ tx }: { tx: SupplyTransaction }) {
  if (tx.status === 'delivered') return <Badge variant="success">Delivered</Badge>;
  if (tx.status === 'staged') return <Badge variant="default">Staged</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

export default function CleaningDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cleaning, isLoading, error } = useCleaningDetail(id!);
  const updateCleaning = useUpdateCleaningDetail();
  const { data: cleaners } = useCleanerUsers();
  const assign = useAssignCleaner();
  const unassign = useUnassignCleaner();
  const assignMe = useAssignMe();
  const { data: allTx } = useSupplyTransactions();
  const createTx = useCreateSupplyTransaction();
  const fulfill = useFulfillTransaction();
  const deliver = useDeliverTransaction();
  const { data: supplyData } = useSupplies();
  const { user } = useAuthStore();
  const isAdmin = user?.type === 'administrator' || user?.type === 'supervisor';
  const isCleaner = user?.type === 'cleaner';

  const [assignModal, setAssignModal] = useState(false);
  const [selectedCleaner, setSelectedCleaner] = useState<number | ''>('');
  const [requestModal, setRequestModal] = useState(false);
  const [reqSupplyId, setReqSupplyId] = useState<number | ''>('');
  const [reqAmount, setReqAmount] = useState(1);
  const [statusEdit, setStatusEdit] = useState(false);
  const [statusVal, setStatusVal] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [apiError, setApiError] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const locationPhotos = cleaning?.location?.photos ?? [];

  const handleAssign = async () => {
    if (!cleaning || !selectedCleaner) return;
    await assign.mutateAsync({ cleaningId: cleaning.id, cleanerId: selectedCleaner as number });
    setAssignModal(false);
  };
  const handleUnassign = async () => {
    if (!cleaning) return;
    await unassign.mutateAsync(cleaning.id);
  };
  const handleAssignMe = async () => {
    if (!cleaning) return;
    await assignMe.mutateAsync(cleaning.id);
  };

  const handleRequestSupply = async () => {
    if (!cleaning || !reqSupplyId) return;
    setApiError('');
    try {
      await createTx.mutateAsync({ supply_id: reqSupplyId as number, cleaning_id: cleaning.id, amount: reqAmount, type: 'request' });
      setRequestModal(false);
      setReqSupplyId('');
      setReqAmount(1);
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Failed to request supply.');
    }
  };

  const handleSaveStatus = async () => {
    if (!cleaning) return;
    await updateCleaning.mutateAsync({ id: cleaning.id, status: statusVal, start_time: startTime || undefined, end_time: endTime || undefined });
    setStatusEdit(false);
  };

  // Supply transactions for this cleaning
  const txList: SupplyTransaction[] = cleaning?.supplies ?? allTx?.data?.filter(t => t.cleaning_id === cleaning?.id) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-100 rounded w-48 animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 animate-pulse">
            <div className="h-5 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !cleaning) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 mb-4">Cleaning not found.</p>
        <button onClick={() => navigate('/cleanings')} className="btn-secondary">← Back to Cleanings</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/cleanings')} className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Cleaning #{cleaning.id}</h1>
            <Badge variant={cleaning.tf_status ? 'warning' : 'default'}>{cleaning.tf_status ? 'TF Day' : 'Normal'}</Badge>
            {cleaning.status && <Badge variant="default">{cleaning.status}</Badge>}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(parseISO(cleaning.cleaning_date), 'EEEE, MMMM d yyyy')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Cleaner Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck size={16} className="text-primary-500" />
            <h2 className="font-semibold text-gray-800">Cleaner</h2>
          </div>
          {cleaning.cleaner ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{cleaning.cleaner.name}</p>
                <p className="text-sm text-gray-500">{cleaning.cleaner.email}</p>
              </div>
              {isAdmin && (
                <button onClick={handleUnassign} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <UserX size={15} /> Unassign
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">No cleaner assigned</p>
              {isAdmin && (
                <button onClick={() => setAssignModal(true)} className="btn-secondary text-sm w-full flex items-center justify-center gap-1.5">
                  <UserCheck size={14} /> Assign Cleaner
                </button>
              )}
              {isCleaner && (
                <button onClick={handleAssignMe} disabled={assignMe.isPending} className="btn-primary text-sm w-full">
                  {assignMe.isPending ? 'Assigning…' : 'Assign Me'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Status Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary-500" />
              <h2 className="font-semibold text-gray-800">Status & Times</h2>
            </div>
            {(isAdmin || isCleaner) && !statusEdit && (
              <button onClick={() => { setStatusEdit(true); setStatusVal(cleaning.status ?? ''); setStartTime(cleaning.start_time ?? ''); setEndTime(cleaning.end_time ?? ''); }}
                className="text-xs text-primary-600 hover:underline">Edit</button>
            )}
          </div>
          {statusEdit ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <input className="input w-full text-sm" value={statusVal} onChange={e => setStatusVal(e.target.value)} placeholder="e.g. completed" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
                  <input className="input w-full text-sm" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
                  <input className="input w-full text-sm" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStatusEdit(false)} className="btn-secondary text-sm flex-1">Cancel</button>
                <button onClick={handleSaveStatus} disabled={updateCleaning.isPending} className="btn-primary text-sm flex-1">
                  {updateCleaning.isPending ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="text-gray-500">Status: <span className="text-gray-900 font-medium">{cleaning.status ?? '—'}</span></p>
              <p className="text-gray-500">Start: <span className="text-gray-900 font-medium">{cleaning.start_time ?? '—'}</span></p>
              <p className="text-gray-500">End: <span className="text-gray-900 font-medium">{cleaning.end_time ?? '—'}</span></p>
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      {cleaning.location && (
        <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-primary-500" />
            <h2 className="font-semibold text-gray-800">Property</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-sm">
              <p className="font-medium text-gray-900">{cleaning.location.building_name} #{cleaning.location.room_number}</p>
              <p className="text-gray-500">{cleaning.location.address}</p>
              {cleaning.location.entry_info && (
                <p className="text-gray-500 bg-amber-50 rounded-lg px-3 py-1.5 text-xs mt-2">
                  🔑 {cleaning.location.entry_info}
                </p>
              )}
              {cleaning.location.mail_rules && (
                <p className="text-gray-500 bg-blue-50 rounded-lg px-3 py-1.5 text-xs mt-1">
                  📬 <span className="font-medium text-blue-700">Mail:</span> {cleaning.location.mail_rules}
                </p>
              )}
              {cleaning.location.trash_rules && (
                <p className="text-gray-500 bg-green-50 rounded-lg px-3 py-1.5 text-xs mt-1">
                  🗑️ <span className="font-medium text-green-700">Trash:</span> {cleaning.location.trash_rules}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-2">
                {cleaning.location.map_link && (
                  <a href={cleaning.location.map_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary-600 hover:underline text-xs">
                    <MapPin size={12} /> View on map
                  </a>
                )}
                {cleaning.location.guest_photo_directions_link && (
                  <a href={cleaning.location.guest_photo_directions_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-purple-600 hover:underline text-xs">
                    📷 Photo Directions
                  </a>
                )}
              </div>
            </div>
            {locationPhotos.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {locationPhotos.slice(0, 4).map((p, idx) => {
                  const url = getPhotoUrl(p.full_path ?? p.thumb_path);
                  return (
                    <div key={p.id} className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer"
                      onClick={() => setLightboxIndex(idx)}
                    >
                      <img
                        src={url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:brightness-90 transition"
                        onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        <ZoomIn size={18} className="text-white drop-shadow" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      )}

      {/* Next Booking */}
      {cleaning.next_booking && typeof cleaning.next_booking === 'object' && (
        <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={16} className="text-primary-500" />
            <h2 className="font-semibold text-gray-800">Next Booking</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Check-in: {format(parseISO((cleaning.next_booking as any).checkin), 'EEE, MMM d yyyy')}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {(cleaning.next_booking as any).guests} guests · {(cleaning.next_booking as any).beds} beds
              </p>
            </div>
            <button
              onClick={() => navigate(`/bookings/${(cleaning.next_booking as any).id}`)}
              className="btn-secondary text-sm"
            >
              View Booking →
            </button>
          </div>
        </div>
      )}

      {/* Supply Requests */}
      <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-primary-500" />
            <h2 className="font-semibold text-gray-800">Supply Requests</h2>
          </div>
          {(isAdmin || isCleaner) && (
            <button onClick={() => setRequestModal(true)} className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
              <Plus size={14} /> Request
            </button>
          )}
        </div>

        {txList.length === 0 ? (
          <p className="text-sm text-gray-400">No supply requests yet.</p>
        ) : (
          <div className="space-y-2">
            {txList.map(tx => (
              <div key={tx.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.supply?.name ?? `Supply #${tx.supply_id}`}</p>
                  <p className="text-xs text-gray-500">Qty: {tx.amount ?? 1}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TxStatusBadge tx={tx} />
                  {isAdmin && (!tx.status || tx.status === 'not_fulfilled') && (
                    <button onClick={() => fulfill.mutateAsync(tx.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Mark fulfilled">
                      <CheckCircle2 size={15} />
                    </button>
                  )}
                  {isAdmin && tx.status === 'staged' && (
                    <button onClick={() => deliver.mutateAsync(tx.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Mark delivered">
                      <Truck size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Cleaner Modal */}
      <Modal open={assignModal} onClose={() => setAssignModal(false)} title="Assign Cleaner" maxWidth="max-w-sm">
        <div className="space-y-4">
          <select className="input w-full" value={selectedCleaner} onChange={e => setSelectedCleaner(Number(e.target.value))}>
            <option value="">— select —</option>
            {cleaners?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex justify-end gap-3">
            <button onClick={() => setAssignModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAssign} disabled={!selectedCleaner || assign.isPending} className="btn-primary">
              {assign.isPending ? 'Assigning…' : 'Assign'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Request Supply Modal */}
      <Modal open={requestModal} onClose={() => setRequestModal(false)} title="Request Supply" maxWidth="max-w-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supply Item</label>
            <select className="input w-full" value={reqSupplyId} onChange={e => setReqSupplyId(Number(e.target.value))}>
              <option value="">— select —</option>
              {supplyData?.data?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input type="number" min={1} className="input w-full" value={reqAmount} onChange={e => setReqAmount(parseInt(e.target.value) || 1)} />
          </div>
          {apiError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{apiError}</p>}
          <div className="flex justify-end gap-3">
            <button onClick={() => setRequestModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleRequestSupply} disabled={!reqSupplyId || createTx.isPending} className="btn-primary">
              {createTx.isPending ? 'Requesting…' : 'Request'}
            </button>
          </div>
        </div>
      </Modal>
      {/* Lightbox with prev/next navigation */}
      {lightboxIndex !== null && locationPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={24} />
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition"
              onClick={e => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Image */}
          <img
            src={getPhotoUrl(locationPhotos[lightboxIndex].full_path ?? locationPhotos[lightboxIndex].thumb_path)}
            alt={locationPhotos[lightboxIndex].name}
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          {lightboxIndex < locationPhotos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition"
              onClick={e => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Counter */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {lightboxIndex + 1} / {locationPhotos.length}
          </p>
        </div>
      )}
    </div>
  );
}
