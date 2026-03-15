import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useUsers, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import Badge, { userTypeToBadgeVariant } from '../components/ui/Badge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import type { UserType, User } from '../types';

const USER_TYPES: UserType[] = ['administrator', 'client', 'supervisor', 'cleaner', 'guest', 'messenger', 'accountant', 'banned'];

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

export default function Users() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useUsers(page);
  const update = useUpdateUser();
  const remove = useDeleteUser();

  const handleUpdate = async (id: number, type: UserType) => {
    await update.mutateAsync({ id, type });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.total ?? 0} registered users</p>
        </div>
      </div>

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
