import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger:  'bg-red-50 text-red-700',
  info:    'bg-blue-50 text-blue-700',
  purple:  'bg-purple-50 text-purple-700',
};

// Automatic variant map by string value
export function userTypeToBadgeVariant(type: string): BadgeVariant {
  switch (type) {
    case 'administrator': return 'danger';
    case 'supervisor':    return 'purple';
    case 'client':        return 'info';
    case 'cleaner':       return 'success';
    case 'banned':        return 'warning';
    default:              return 'default';
  }
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
