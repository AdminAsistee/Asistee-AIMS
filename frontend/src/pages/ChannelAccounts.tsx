import { useState } from 'react';
import { Link2, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import {
  useChannelAccounts,
  useCreateChannelAccount,
  useUpdateChannelAccount,
  useDeleteChannelAccount,
} from '../hooks/useChannelAccounts';
import Modal from '../components/ui/Modal';
import { CHANNEL_LABELS } from '../types';
import type { ChannelAccount } from '../types';

// ─── Channel badge ─────────────────────────────────────────────────────────────
function ChannelBadge({ channelId }: { channelId: number }) {
  const colors: Record<number, string> = {
    0: 'bg-gray-100 text-gray-700',
    1: 'bg-red-100 text-red-700',
    2: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[channelId] ?? 'bg-gray-100 text-gray-700'}`}>
      {CHANNEL_LABELS[channelId] ?? 'Unknown'}
    </span>
  );
}

// ─── Empty form state ──────────────────────────────────────────────────────────
const EMPTY_FORM = { description: '', channel_id: 2 as 0 | 1 | 2, authentication_token: '' };

export default function ChannelAccounts() {
  const { data: accounts = [], isLoading } = useChannelAccounts();
  const createMutation  = useCreateChannelAccount();
  const updateMutation  = useUpdateChannelAccount();
  const deleteMutation  = useDeleteChannelAccount();

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [createError, setCreateError] = useState('');

  // Inline edit state: accountId → form
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ChannelAccount>>({});

  // Delete confirm
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState('');

  // ── Handlers ──────────────────────────────────────────────────────────────────
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError('');
    try {
      await createMutation.mutateAsync({
        description: form.description,
        channel_id: form.channel_id,
        authentication_token: form.authentication_token || undefined,
      });
      setShowCreate(false);
      setForm(EMPTY_FORM);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setCreateError(msg ?? 'Failed to create channel account.');
    }
  }

  function startEdit(account: ChannelAccount) {
    setEditingId(account.id);
    setEditForm({
      description: account.description,
      channel_id: account.channel_id,
      authentication_token: '',
    });
  }

  async function handleUpdate() {
    if (!editingId) return;
    try {
      await updateMutation.mutateAsync({ id: editingId, ...editForm });
      setEditingId(null);
    } catch {/* silently handled */ }
  }

  async function handleDelete(id: number) {
    setDeleteError('');
    try {
      await deleteMutation.mutateAsync(id);
      setDeletingId(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setDeleteError(msg ?? 'Failed to delete.');
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Channel Accounts</h1>
            <p className="text-sm text-gray-500">Manage OTA and iCal connections for your listings</p>
          </div>
        </div>
        <button
          id="add-channel-account-btn"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Channel Account
        </button>
      </div>

      {/* Info card */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-800">
        <p className="font-semibold mb-1">How channels work</p>
        <ul className="list-disc list-inside space-y-1 text-indigo-700">
          <li><strong>iCal (type 2)</strong> — Paste an Airbnb / Booking.com iCal URL. Use "Sync Now" from the Location Listings tab to import bookings.</li>
          <li><strong>Manual (type 0)</strong> — Bookings entered by hand (default for all new locations).</li>
          <li><strong>Airbnb API (type 1)</strong> — Requires an OAuth token. Coming soon.</li>
        </ul>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-gray-400 text-center py-16">Loading channel accounts…</p>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Link2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No channel accounts yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Description</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-center px-5 py-3 text-gray-500 font-medium">Listings</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">iCal / Token URL</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                  {editingId === account.id ? (
                    <>
                      {/* Inline edit row */}
                      <td className="px-5 py-3">
                        <input
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={editForm.description ?? ''}
                          onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                          placeholder="Description"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={editForm.channel_id ?? 0}
                          onChange={(e) => setEditForm((f) => ({ ...f, channel_id: Number(e.target.value) as 0 | 1 | 2 }))}
                        >
                          <option value={0}>Manual</option>
                          <option value={1}>Airbnb</option>
                          <option value={2}>iCal</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-center text-gray-500">{account.listings_count ?? 0}</td>
                      <td className="px-5 py-3">
                        <input
                          className="border rounded px-2 py-1 w-full text-sm font-mono"
                          value={editForm.authentication_token ?? ''}
                          onChange={(e) => setEditForm((f) => ({ ...f, authentication_token: e.target.value }))}
                          placeholder="New iCal URL or token (leave blank to keep existing)"
                        />
                      </td>
                      <td className="px-5 py-3 flex items-center gap-2 justify-end">
                        <button
                          onClick={handleUpdate}
                          className="p-1.5 rounded text-green-600 hover:bg-green-50"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded text-gray-500 hover:bg-gray-100"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Normal row */}
                      <td className="px-5 py-3 font-medium text-gray-800">{account.description}</td>
                      <td className="px-5 py-3"><ChannelBadge channelId={account.channel_id} /></td>
                      <td className="px-5 py-3 text-center text-gray-600">{account.listings_count ?? 0}</td>
                      <td className="px-5 py-3 text-gray-400 font-mono text-xs truncate max-w-xs">
                        {account.authentication_token ? '••••••••••••' : <span className="italic">No token set</span>}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => startEdit(account)}
                            className="p-1.5 rounded text-indigo-500 hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setDeletingId(account.id); setDeleteError(''); }}
                            className="p-1.5 rounded text-red-400 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create Modal ── */}
      <Modal open={showCreate} onClose={() => { setShowCreate(false); setCreateError(''); }} title="Add Channel Account">
        <form onSubmit={handleCreate} className="space-y-4">
          {createError && (
            <p className="text-sm text-red-600 bg-red-50 rounded p-2">{createError}</p>
          )}
          <div>
            <label htmlFor="ca-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              id="ca-description"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
              placeholder="e.g. Airbnb Account - Dogenzaka"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="ca-channel-type" className="block text-sm font-medium text-gray-700 mb-1">
              Channel Type <span className="text-red-500">*</span>
            </label>
            <select
              id="ca-channel-type"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
              value={form.channel_id}
              onChange={(e) => setForm((f) => ({ ...f, channel_id: Number(e.target.value) as 0 | 1 | 2 }))}
            >
              <option value={0}>Manual (no external sync)</option>
              <option value={1}>Airbnb (API token)</option>
              <option value={2}>iCal (URL)</option>
            </select>
          </div>
          {form.channel_id !== 0 && (
            <div>
              <label htmlFor="ca-token" className="block text-sm font-medium text-gray-700 mb-1">
                {form.channel_id === 2 ? 'iCal URL' : 'API Token'}
              </label>
              <input
                id="ca-token"
                className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-300 outline-none"
                placeholder={
                  form.channel_id === 2
                    ? 'https://www.airbnb.com/calendar/ical/…'
                    : 'Paste your API token here'
                }
                value={form.authentication_token}
                onChange={(e) => setForm((f) => ({ ...f, authentication_token: e.target.value }))}
              />
              <p className="text-xs text-gray-400 mt-1">Stored encrypted. You can update it later.</p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowCreate(false); setCreateError(''); }}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Saving…' : 'Add Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal open={!!deletingId} onClose={() => { setDeletingId(null); setDeleteError(''); }} title="Delete Channel Account">
        <p className="text-sm text-gray-600 mb-4">
          Are you sure? This action cannot be undone. Listings linked to this account will lose their channel connection.
        </p>
        {deleteError && <p className="text-sm text-red-600 bg-red-50 rounded p-2 mb-3">{deleteError}</p>}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => { setDeletingId(null); setDeleteError(''); }}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => deletingId && handleDelete(deletingId)}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
