// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export type UserType =
  | 'administrator'
  | 'client'
  | 'supervisor'
  | 'cleaner'
  | 'guest'
  | 'messenger'
  | 'accountant'
  | 'banned';

export interface User {
  id: number;
  name: string;
  email: string;
  type: UserType;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ─── Location ─────────────────────────────────────────────────────────────────
export interface PropertyPhoto {
  id: number;
  location_id: number;
  user_id: number;
  full_path: string;
  thumb_path?: string;
  name: string;
  type: string;
}

export interface Location {
  id: number;
  building_name: string;
  room_number: number;
  address: string;
  latitude: number;
  longitude: number;
  owner_id: number;
  map_link?: string;
  entry_info?: string;
  owner?: User;
  photos?: PropertyPhoto[];
  listings?: Listing[];
  created_at?: string;
  updated_at?: string;
}

// ─── Listing ──────────────────────────────────────────────────────────────────
export interface Listing {
  id: number;
  locations?: Location[];
  bookings?: Booking[];
  created_at?: string;
  updated_at?: string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────
export interface Booking {
  id: number;
  listing_id: number;
  checkin: string;
  checkout: string;
  guests: number;
  beds: number;
  planned_checkin_time?: string | null;
  planned_checkout_time?: string | null;
  listing?: Listing;
  created_at?: string;
  updated_at?: string;
}

// ─── Cleaning ─────────────────────────────────────────────────────────────────
export interface Cleaning {
  id: number;
  location_id: number;
  cleaning_date: string;
  cleaner_id?: number | null;
  status?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  tf_status?: boolean;
  next_booking?: Booking | false;
  location?: Location;
  cleaner?: User | null;
  created_at?: string;
  updated_at?: string;
}

// ─── Supply ───────────────────────────────────────────────────────────────────
export interface Supply {
  id: number;
  name: string;
  ready_stock: number;
  in_use_stock: number;
  in_maintenance_stock: number;
  created_at?: string;
  updated_at?: string;
}
