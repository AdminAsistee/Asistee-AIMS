import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import Badge, { userTypeToBadgeVariant } from '../components/ui/Badge';
import api from '../lib/api';

const profileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  password: z.string().min(6, 'At least 6 characters').max(64),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: "Passwords don't match", path: ['confirm'] });
type PasswordForm = z.infer<typeof passwordSchema>;

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      bio: user?.bio ?? '',
      address: user?.address ?? '',
    },
  });

  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = profileForm.handleSubmit(async (values) => {
    setProfileError('');
    setProfileSuccess(false);
    try {
      const res = await api.put(`/api/v1/users/${user?.id}`, values);
      setUser({ ...user!, ...res.data });
      setProfileSuccess(true);
    } catch (e: any) {
      setProfileError(e?.response?.data?.message ?? 'Failed to update profile.');
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
    setPasswordError('');
    setPasswordSuccess(false);
    try {
      await api.put(`/api/v1/users/${user?.id}`, { password: values.password });
      passwordForm.reset();
      setPasswordSuccess(true);
    } catch (e: any) {
      setPasswordError(e?.response?.data?.message ?? 'Failed to update password.');
    }
  });

  if (!user) return null;

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Avatar + Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <Badge variant={userTypeToBadgeVariant(user.type)} className="mt-1.5">{user.type}</Badge>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Edit Profile</h3>
        <form onSubmit={onProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input {...profileForm.register('name')} className="input w-full" />
              {profileForm.formState.errors.name && (
                <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...profileForm.register('email')} type="email" className="input w-full" />
              {profileForm.formState.errors.email && (
                <p className="text-xs text-red-500 mt-1">{profileForm.formState.errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input {...profileForm.register('phone')} className="input w-full" placeholder="+81 90-0000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input {...profileForm.register('address')} className="input w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea {...profileForm.register('bio')} rows={2} className="input w-full resize-none" placeholder="A short bio about yourself..." />
          </div>

          {profileError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{profileError}</p>}
          {profileSuccess && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">✓ Profile updated successfully!</p>}

          <div className="flex justify-end">
            <button type="submit" disabled={profileForm.formState.isSubmitting} className="btn-primary">
              {profileForm.formState.isSubmitting ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={onPasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input {...passwordForm.register('password')} type="password" className="input w-full" placeholder="Min 6 characters" />
              {passwordForm.formState.errors.password && (
                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input {...passwordForm.register('confirm')} type="password" className="input w-full" />
              {passwordForm.formState.errors.confirm && (
                <p className="text-xs text-red-500 mt-1">{passwordForm.formState.errors.confirm.message}</p>
              )}
            </div>
          </div>

          {passwordError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">✓ Password updated!</p>}

          <div className="flex justify-end">
            <button type="submit" disabled={passwordForm.formState.isSubmitting} className="btn-primary">
              {passwordForm.formState.isSubmitting ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
