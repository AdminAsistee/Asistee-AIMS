import { useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import type { UserType, User } from '../types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const USER_TYPES: UserType[] = ['administrator', 'client', 'supervisor', 'cleaner', 'guest', 'messenger', 'accountant', 'banned'];

// ── Add User form schema ────────────────────────────────────────────────────
const addUserSchema = z.object({
  name:     z.string().min(3, 'Name must be at least 3 characters'),
  email:    z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  type:     z.enum(['administrator', 'client', 'supervisor', 'cleaner', 'guest', 'messenger', 'accountant', 'banned']),
});
type AddUserForm = z.infer<typeof addUserSchema>;

// ── Inline role select ──────────────────────────────────────────────────────
function RoleSelect({ user, onUpdate }: { user: User; onUpdate: (id: number, type: UserType) => void }) {
  const [value, setValue] = useState<UserType>(user.type);
  const [dirty, setDirty] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={e => { setValue(e.target.value as UserType); setDirty(true); }}
        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-400"
      >
        {USER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      {dirty && (
        <button
          onClick={() => { onUpdate(user.id, value); setDirty(false); }}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          Save
        </button>
      )}
    </div>
  );
}

// ── Add User Modal ──────────────────────────────────────────────────────────
function AddUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateUser();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { type: 'client' },
  });

  const onSubmit = async (data: AddUserForm) => {
    await create.mutateAsync(data);
    reset();
    onClose();
  };

  const field = 'px-3 py-2 rounded-lg border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-400';
  const label = 'block text-xs font-medium text-gray-600 mb-1';
  const err   = 'text-xs text-red-500 mt-1';

  return (
    <Modal open={open} onClose={onClose} title="Add New User">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className={label} htmlFor="add-name">Full Name</label>
          <input id="add-name" {...register('name')} className={field} placeholder="John Smith" />
          {errors.name && <p className={err}>{errors.name.message}</p>}
        </div>

        <div>
          <label className={label} htmlFor="add-email">Email</label>
          <input id="add-email" type="email" {...register('email')} className={field} placeholder="john@example.com" />
          {errors.email && <p className={err}>{errors.email.message}</p>}
        </div>

        <div>
          <label className={label} htmlFor="add-password">Password</label>
          <input id="add-password" type="password" {...register('password')} className={field} placeholder="Min. 6 characters" />
          {errors.password && <p className={err}>{errors.password.message}</p>}
        </div>

        <div>
          <label className={label} htmlFor="add-type">Role</label>
          <select id="add-type" {...register('type')} className={field}>
            {USER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.type && <p className={err}>{errors.type.message}</p>}
        </div>

        {create.isError && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
            Failed to create user. Email may already be taken.
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || create.isPending}
            className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors">
            {create.isPending ? 'Creating…' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Main Users Page ─────────────────────────────────────────────────────────
export default function Users() {
  const [page, setPage]           = useState(1);
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [addOpen, setAddOpen]     = useState(false);

  const { data, isLoading } = useUsers(page);
  const update = useUpdateUser();
  const remove = useDeleteUser();

  const handleUpdate = async (id: number, type: UserType) => {
    await update.mutateAsync({ id, type });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.total ?? 0} registered users</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                {['#', 'Name', 'Email', 'Role', 'Joined', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && [...Array(5)].map((_, i) => (
                <tr key={i}>{[...Array(6)].map((_, j) => (
                  <td key={j} className="px-5 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                ))}</tr>
              ))}
              {!isLoading && data?.data?.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">{u.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <RoleSelect user={u} onUpdate={handleUpdate} />
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {u.created_at ? format(parseISO(u.created_at), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => setDeleteId(u.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && !data?.data?.length && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={data?.current_page ?? 1} lastPage={data?.last_page ?? 1} from={data?.from} to={data?.to} total={data?.total} onPageChange={setPage} />
      </div>

      {/* Add User Modal */}
      <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await remove.mutateAsync(deleteId); setDeleteId(null); } }}
        title="Delete User"
        message={`Permanently delete user #${deleteId}? This cannot be undone.`}
        loading={remove.isPending}
      />
    </div>
  );
}
