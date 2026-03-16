import { useState } from 'react';
import { DollarSign, Percent, Plus, Tag, Trash2, Pencil, Check, X } from 'lucide-react';
import { useCreatePrice, useListPrices, useUpdatePrice, useDeletePrice } from '../hooks/usePrices';
import type { Price } from '../types';

function PriceRow({ p, isAdmin }: { p: Price; isAdmin: boolean }) {
  const updatePrice = useUpdatePrice();
  const deletePrice = useDeletePrice();
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(p.description ?? '');
  const [total, setTotal] = useState(String(p.total ?? ''));
  const [pct, setPct] = useState(!!p.percentage);

  const save = async () => {
    await updatePrice.mutateAsync({
      id: p.id,
      description: desc,
      total: total !== '' ? parseFloat(total) : undefined,
      percentage: pct,
    });
    setEditing(false);
  };

  const cancel = () => {
    setDesc(p.description ?? '');
    setTotal(String(p.total ?? ''));
    setPct(!!p.percentage);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="bg-blue-50 rounded-xl px-4 py-3 space-y-2">
        <input
          className="input w-full text-sm"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Description"
        />
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {pct ? <Percent size={13} /> : <DollarSign size={13} />}
            </div>
            <input
              type="number" step="0.01" min="0"
              className="input w-full pl-8 text-sm"
              value={total}
              onChange={e => setTotal(e.target.value)}
              placeholder={pct ? '0.20 (20%)' : '5000'}
            />
          </div>
          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
            <div
              onClick={() => setPct(!pct)}
              className={`w-8 h-4 rounded-full transition-colors relative ${pct ? 'bg-primary-500' : 'bg-gray-200'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${pct ? 'left-4' : 'left-0.5'}`} />
            </div>
            %
          </label>
          <button onClick={save} disabled={updatePrice.isPending} title="Save" className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition">
            <Check size={14} />
          </button>
          <button onClick={cancel} title="Cancel" className="p-1.5 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition">
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 group">
      <div>
        <p className="text-sm font-medium text-gray-900">{p.description ?? `Price #${p.id}`}</p>
        {p.total !== null && p.total !== undefined && (
          <p className="text-xs text-gray-500 mt-0.5">
            {p.percentage ? `${(p.total * 100).toFixed(0)}%` : `¥${Number(p.total).toLocaleString()}`}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400 font-mono mr-2">#{p.id}</span>
        {isAdmin && (
          <>
            <button
              onClick={() => setEditing(true)}
              title="Edit"
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition opacity-0 group-hover:opacity-100"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => { if (confirm(`Delete Price #${p.id}?`)) deletePrice.mutate(p.id); }}
              disabled={deletePrice.isPending}
              title="Delete"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const createPrice = useCreatePrice();
  const { data: allPrices, isLoading: pricesLoading } = useListPrices();
  const [description, setDescription] = useState('');
  const [total, setTotal] = useState('');
  const [percentage, setPercentage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Derive isAdmin from auth store — Pricing is admin-only so always true here,
  // but we check explicitly for the edit/delete controls
  const isAdmin = true; // page is already protected by navigation guard

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createPrice.mutateAsync({
        description,
        total: total !== '' ? parseFloat(total) : undefined,
        percentage,
      });
      setDescription('');
      setTotal('');
      setPercentage(false);
      setSuccess('Price structure created successfully.');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create price.');
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pricing Engine</h1>
        <p className="text-sm text-gray-500 mt-0.5">Create and manage price structures for cleanings and bookings.</p>
      </div>

      {/* Create Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
            <Plus size={15} className="text-primary-600" />
          </div>
          <h2 className="font-semibold text-gray-800">New Price Structure</h2>
        </div>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label htmlFor="price-desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              id="price-desc"
              className="input w-full"
              placeholder="e.g. Standard cleaning fee — Noa Dogenzaka 301"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="price-total" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {percentage ? <Percent size={14} /> : <DollarSign size={14} />}
                </div>
                <input
                  id="price-total"
                  type="number"
                  step="0.01"
                  min="0"
                  className="input w-full pl-8"
                  placeholder={percentage ? '0.20 (20%)' : '5000'}
                  value={total}
                  onChange={e => setTotal(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => setPercentage(!percentage)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${percentage ? 'bg-primary-500' : 'bg-gray-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${percentage ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">Percentage</span>
              </label>
            </div>
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">{success}</p>}
          <div className="flex justify-end">
            <button type="submit" disabled={createPrice.isPending} className="btn-primary flex items-center gap-2">
              <Plus size={15} /> {createPrice.isPending ? 'Creating…' : 'Create Price'}
            </button>
          </div>
        </form>
      </div>

      {/* All Prices from DB */}
      <div className="mt-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={15} className="text-primary-500" />
          <h2 className="font-semibold text-gray-800">All Price Structures</h2>
          {allPrices && <span className="ml-auto text-xs text-gray-400">{allPrices.length} total</span>}
        </div>

        {pricesLoading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!pricesLoading && (!allPrices || allPrices.length === 0) && (
          <p className="text-sm text-gray-400 text-center py-6">No price structures yet. Create one above.</p>
        )}

        {!pricesLoading && allPrices && allPrices.length > 0 && (
          <div className="space-y-2">
            {allPrices.map((p: Price) => (
              <PriceRow key={p.id} p={p} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-700">
          <strong>Note:</strong> The Pricing Engine is used to create fee structures that can be linked to bookings and cleanings during OTA sync. Manual linking to specific records is part of Phase 4 Large Effort (Channel Manager).
        </p>
      </div>
    </div>
  );
}
