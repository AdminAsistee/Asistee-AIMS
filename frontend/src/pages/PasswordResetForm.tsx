import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import api from '../lib/api';

export default function PasswordResetForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/v1/reset-password', { email, token, password, password_confirmation: confirm });
      navigate('/login?reset=1');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="mb-8">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
              <KeyRound size={22} className="text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your email and choose a new password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="reset-email"
                type="email"
                className="input w-full"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input
                id="new-password"
                type="password"
                className="input w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                className="input w-full"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Resetting…' : 'Reset password'}
            </button>
            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-primary-600 hover:underline font-medium">← Back to login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
