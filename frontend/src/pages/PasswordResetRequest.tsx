import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import api from '../lib/api';

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/v1/request-password-reset', { email });
      const token = res.data?.token;
      if (token) {
        // Backend returns token directly (SMTP optional) — redirect immediately
        navigate(`/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
      } else {
        // SMTP configured — token not exposed, show "check inbox" message
        navigate(`/login?reset_requested=1`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to send reset email. Please try again.');
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
              <Mail size={22} className="text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your account email to get a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="reset-email"
                type="email"
                className="input w-full"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Checking…' : 'Send reset link'}
            </button>
            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-primary-600 hover:underline font-medium">
                ← Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
