import { useState } from 'react';
import { Plus, ShoppingCart, Wrench, X, Clock, CheckCircle2, Truck, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupplies, useCreateSupply, useBuySupply, useUseSupply } from '../hooks/useSupplies';
import { useSupplyTransactions, useFulfillTransaction, useDeliverTransaction } from '../hooks/useSupplyTransactions';
import Modal from '../components/ui/Modal';
import { useAuthStore } from '../stores/authStore';
import type { Supply, SupplyTransaction } from '../types';

const supplySchema = z.object({
  name: z.string().min(1, 'Name required'),
  ready_stock: z.number().int().min(0).optional(),
  in_use_stock: z.number().int().min(0).optional(),
  in_maintenance_stock: z.number().int().min(0).optional(),
});
type SupplyForm = z.infer<typeof supplySchema>;

const amountSchema = z.object({ amount: z.number().int().min(1, 'At least 1 required') });
type AmountForm = z.infer<typeof amountSchema>;

function StockBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{label}</span><span className="font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function AmountModal({ open, onClose, title, onConfirm, pending }: { open: boolean; onClose: () => void; title: string; onConfirm: (amount: number) => void; pending: boolean }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AmountForm>({ resolver: zodResolver(amountSchema) });
  return (
    <Modal open={open} onClose={() => { onClose(); reset(); }} title={title} maxWidth="max-w-sm">
      <form onSubmit={handleSubmit(v => { onConfirm(v.amount); reset(); })} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input {...register('amount', { valueAsNumber: true })} type="number" min={1} className="input w-full" autoFocus />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={pending} className="btn-primary">{pending ? 'Saving…' : 'Confirm'}</button>
        </div>
      </form>
    </Modal>
  );
}

function TransactionRow({ tx, isAdmin, onFulfill, onDeliver, fulfillPending, deliverPending }: {
  tx: SupplyTransaction;
  isAdmin: boolean;
  onFulfill: () => void;
  onDeliver: () => void;
  fulfillPending: boolean;
  deliverPending: boolean;
}) {
  const isFulfilled = tx.status === 'staged' || tx.status === 'delivered';
  const isDelivered = tx.status === 'delivered';
  const typeColors: Record<string, string> = {
    request: 'bg-blue-50 text-blue-700',
    buy:     'bg-emerald-50 text-emerald-700',
    use:     'bg-amber-50 text-amber-700',
  };
  const typeLabel = tx.type ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1) : 'Request';

  return (
    <div className="border border-gray-100 rounded-xl p-3.5 bg-white hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[tx.type ?? 'request'] ?? typeColors.request}`}>
            {typeLabel}
          </span>
          <span className="text-sm font-semibold text-gray-800">×{tx.amount ?? 1}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
          <Clock size={11} />
          {tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-JP', { month: 'short', day: 'numeric' }) : '—'}
        </div>
      </div>

      {/* Status chips */}
      <div className="flex items-center gap-2 flex-wrap mb-2.5">
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
          isFulfilled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
        }`}>
          <CheckCircle2 size={11} />
          {isFulfilled ? 'Staged' : 'Not fulfilled'}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
          isDelivered ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-400'
        }`}>
          <Truck size={11} />
          {isDelivered ? 'Delivered' : 'Not delivered'}
        </div>
      </div>

      {tx.cleaning_id && (
        <p className="text-xs text-gray-400 mb-2.5">Cleaning #{tx.cleaning_id}</p>
      )}

      {/* Admin action buttons */}
      {isAdmin && (!isFulfilled || !isDelivered) && (
        <div className="flex gap-2">
          {!isFulfilled && (
            <button
              onClick={onFulfill}
              disabled={fulfillPending}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors font-medium"
            >
              <CheckCircle2 size={11} /> {fulfillPending ? 'Saving…' : 'Mark Fulfilled'}
            </button>
          )}
          {isFulfilled && !isDelivered && (
            <button
              onClick={onDeliver}
              disabled={deliverPending}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
            >
              <Truck size={11} /> {deliverPending ? 'Saving…' : 'Mark Delivered'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SupplyTransactionDrawer({ supply, onClose, isAdmin }: {
  supply: Supply | null;
  onClose: () => void;
  isAdmin: boolean;
}) {
  const { data, isLoading } = useSupplyTransactions(supply?.id);
  const fulfill = useFulfillTransaction();
  const deliver = useDeliverTransaction();

  if (!supply) return null;

  const transactions: SupplyTransaction[] = data?.data ?? [];
  const total = supply.ready_stock + supply.in_use_stock + supply.in_maintenance_stock;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{supply.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Transaction History</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Stock summary */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <p className="text-xs font-medium text-gray-500 mb-2.5 uppercase tracking-wide">Current Stock — {total} total</p>
          <div className="space-y-2">
            <StockBar label="Ready" value={supply.ready_stock} total={total || 1} color="bg-emerald-400" />
            <StockBar label="In Use" value={supply.in_use_stock} total={total || 1} color="bg-blue-400" />
            <StockBar label="In Maintenance" value={supply.in_maintenance_stock} total={total || 1} color="bg-amber-400" />
          </div>
        </div>

        {/* Transaction list */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3.5 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}
          {!isLoading && transactions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No transactions yet for this supply item.</p>
            </div>
          )}
          {!isLoading && transactions.length > 0 && (
            <div className="space-y-3">
              {transactions.map(tx => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  isAdmin={isAdmin}
                  onFulfill={() => fulfill.mutate(tx.id)}
                  onDeliver={() => deliver.mutate(tx.id)}
                  fulfillPending={fulfill.isPending}
                  deliverPending={deliver.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Supplies() {
  const [createOpen, setCreateOpen] = useState(false);
  const [buySupply, setBuySupply] = useState<Supply | null>(null);
  const [useSupply, setUseSupply] = useState<Supply | null>(null);
  const [historySupply, setHistorySupply] = useState<Supply | null>(null);
  const [apiError, setApiError] = useState('');

  const { data, isLoading } = useSupplies();
  const create = useCreateSupply();
  const buy = useBuySupply();
  const use = useUseSupply();
  const { user } = useAuthStore();
  const canManage = user?.type === 'administrator' || user?.type === 'supervisor';

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplyForm>({ resolver: zodResolver(supplySchema) });

  const onSubmit = handleSubmit(async (values) => {
    setApiError('');
    try {
      await create.mutateAsync(values);
      reset();
      setCreateOpen(false);
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Failed to create supply.');
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supplies</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.total ?? 0} supply items</p>
        </div>
        {canManage && (
          <button onClick={() => setCreateOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Supply
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading && [...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
            <div className="h-5 bg-gray-100 rounded w-2/3 mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded" />
              <div className="h-3 bg-gray-100 rounded" />
              <div className="h-3 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
        {!isLoading && data?.data?.map(s => {
          const total = s.ready_stock + s.in_use_stock + s.in_maintenance_stock;
          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => setHistorySupply(s)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base group-hover:text-primary-600 transition-colors">{s.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Total: {total} units · <span className="text-primary-500">View history →</span></p>
                </div>
                {canManage && (
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setBuySupply(s)} title="Buy more"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                      <ShoppingCart size={14} />
                    </button>
                    <button onClick={() => setUseSupply(s)} title="Mark as used"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <Wrench size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-2.5">
                <StockBar label="Ready" value={s.ready_stock} total={total || 1} color="bg-emerald-400" />
                <StockBar label="In Use" value={s.in_use_stock} total={total || 1} color="bg-blue-400" />
                <StockBar label="In Maintenance" value={s.in_maintenance_stock} total={total || 1} color="bg-amber-400" />
              </div>
            </div>
          );
        })}
        {!isLoading && !data?.data?.length && (
          <div className="col-span-3 text-center py-16 text-gray-400">No supply items found.</div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); setApiError(''); }} title="New Supply Item">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input {...register('name')} className="input w-full" placeholder="e.g. Bed Sheets" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(['ready_stock', 'in_use_stock', 'in_maintenance_stock'] as const).map(field => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{field.replace(/_/g, ' ')}</label>
                <input {...register(field, { valueAsNumber: true })} type="number" min={0} className="input w-full" defaultValue={0} />
              </div>
            ))}
          </div>
          {apiError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{apiError}</p>}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => setCreateOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={create.isPending} className="btn-primary">
              {create.isPending ? 'Saving…' : 'Create Supply'}
            </button>
          </div>
        </form>
      </Modal>

      <AmountModal
        open={!!buySupply}
        onClose={() => setBuySupply(null)}
        title={`Buy Stock — ${buySupply?.name}`}
        pending={buy.isPending}
        onConfirm={async (amount) => { if (buySupply) { await buy.mutateAsync({ id: buySupply.id, amount }); setBuySupply(null); } }}
      />
      <AmountModal
        open={!!useSupply}
        onClose={() => setUseSupply(null)}
        title={`Use Stock — ${useSupply?.name}`}
        pending={use.isPending}
        onConfirm={async (amount) => { if (useSupply) { await use.mutateAsync({ id: useSupply.id, amount }); setUseSupply(null); } }}
      />

      <SupplyTransactionDrawer
        supply={historySupply}
        onClose={() => setHistorySupply(null)}
        isAdmin={canManage}
      />
    </div>
  );
}
