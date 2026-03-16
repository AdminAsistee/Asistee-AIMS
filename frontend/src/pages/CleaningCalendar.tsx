import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isToday
} from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useCleanerUsers } from '../hooks/useCleanings';
import { useAuthStore } from '../stores/authStore';
import type { Cleaning, PaginatedResponse } from '../types';

const STATUS_COLORS: Record<string, string> = {
  pending:     'bg-amber-100 text-amber-800 border-amber-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  completed:   'bg-emerald-100 text-emerald-800 border-emerald-200',
  done:        'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled:   'bg-gray-100 text-gray-500 border-gray-200',
};

function useCalendarCleanings(year: number, month: number, cleanerId?: number) {
  const thisMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
  return useQuery<PaginatedResponse<Cleaning>>({
    queryKey: ['calendar-cleanings', thisMonth, cleanerId],
    queryFn: () => {
      const params = new URLSearchParams({ thisMonth, perPage: '200' });
      if (cleanerId) params.set('cleaner_id', String(cleanerId));
      return api.get(`/api/v1/cleanings?${params}`).then(r => r.data);
    },
  });
}

export default function CleaningCalendar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.type === 'administrator' || user?.type === 'supervisor';

  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [cleanerId, setCleanerId] = useState<number | undefined>();

  const { data: cleanerList } = useCleanerUsers();
  const { data, isLoading } = useCalendarCleanings(current.getFullYear(), current.getMonth(), cleanerId);

  const cleanings: Cleaning[] = data?.data ?? [];

  // Build calendar grid — weeks starting Monday
  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const cleaningsByDay = useMemo(() => {
    const map: Record<string, Cleaning[]> = {};
    for (const c of cleanings) {
      if (!c.cleaning_date) continue;
      const key = c.cleaning_date.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(c);
    }
    return map;
  }, [cleanings]);

  const prevMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays size={22} className="text-primary-500" />
            Cleaning Calendar
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{cleanings.length} cleaning{cleanings.length !== 1 ? 's' : ''} this month</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Cleaner filter — admin only */}
          {isAdmin && cleanerList && (
            <select
              className="input text-sm py-1.5 pr-8"
              value={cleanerId ?? ''}
              onChange={e => setCleanerId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">All Cleaners</option>
              {cleanerList.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          {/* Month navigation */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button onClick={prevMonth} className="p-2.5 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900">
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 text-sm font-semibold text-gray-900 min-w-[120px] text-center">
              {format(current, 'MMMM yyyy')}
            </span>
            <button onClick={nextMonth} className="p-2.5 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDays.map(d => (
            <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="py-24 text-center text-gray-400 text-sm animate-pulse">
            Loading cleanings…
          </div>
        )}

        {/* Calendar cells */}
        {!isLoading && (
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const key = format(day, 'yyyy-MM-dd');
              const dayCleanings = cleaningsByDay[key] ?? [];
              const isCurrentMonth = isSameMonth(day, current);
              const isDayToday = isToday(day);

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] p-2 border-b border-r border-gray-50 ${
                    idx % 7 === 6 ? 'border-r-0' : ''
                  } ${!isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}`}
                >
                  {/* Day number */}
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1.5 ${
                    isDayToday
                      ? 'bg-primary-500 text-white'
                      : isCurrentMonth
                        ? 'text-gray-700'
                        : 'text-gray-300'
                  }`}>
                    {format(day, 'd')}
                  </div>

                  {/* Cleaning events */}
                  <div className="space-y-1">
                    {dayCleanings.slice(0, 3).map(c => {
                      const statusClass = STATUS_COLORS[c.status ?? 'pending'] ?? STATUS_COLORS.pending;
                      const cleanerName = (c as any).cleaner?.name;
                      return (
                        <button
                          key={c.id}
                          onClick={() => navigate(`/cleanings/${c.id}`)}
                          className={`w-full text-left text-xs px-1.5 py-0.5 rounded border truncate font-medium hover:opacity-80 transition-opacity ${statusClass}`}
                          title={`Cleaning #${c.id}${cleanerName ? ` — ${cleanerName}` : ''}`}
                        >
                          #{c.id}{cleanerName ? ` · ${cleanerName.split(' ')[0]}` : ''}
                          {c.tf_status ? ' 🔄' : ''}
                        </button>
                      );
                    })}
                    {dayCleanings.length > 3 && (
                      <p className="text-xs text-gray-400 pl-1">+{dayCleanings.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {Object.entries({ pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' }).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded border ${STATUS_COLORS[key]}`} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🔄</span>
          <span className="text-xs text-gray-500">TF Day</span>
        </div>
      </div>
    </div>
  );
}
