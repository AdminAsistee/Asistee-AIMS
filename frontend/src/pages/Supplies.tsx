import { useState } from 'react';
import { Plus, ShoppingCart, Wrench } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupplies, useCreateSupply, useBuySupply, useUseSupply } from '../hooks/useSupplies';
import Modal from '../components/ui/Modal';
import { useAuthStore } from '../stores/authStore';
import type { Supply } from '../types';

const supplySchema = z.object({
  name: z.string().min(1, 'Name required'),
  ready_stock: z.number({ coerce: true }).int().min(0).optional(),
  in_use_stock: z.number({ coerce: true }).int().min(0).optional(),
  in_maintenance_stock: z.number({ coerce: true }).int().min(0).optional(),
});
type SupplyForm = z.infer<typeof supplySchema>;

const amountSchema = z.object({ amount: z.number({ coerce: true }).int().min(1, 'At least 1 required') });
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

export default function Supplies() {
  const [createOpen, setCreateOpen] = useState(false);
  const [buySupply, setBuySupply] = useState<Supply | null>(null);
  const [useSupply, setUseSupply] = useState<Supply | null>(null);
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
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{s.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Total: {total} units</p>
                </div>
                {canManage && (
                  <div className="flex gap-1">
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
    </div>
  );
}
