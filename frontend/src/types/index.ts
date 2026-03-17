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
  // Gen 2 fields — all exist in DB, now in $fillable
  mail_rules?: string | null;
  trash_rules?: string | null;
  guest_photo_directions_link?: string | null;
  max_beds?: number | null;
  per_bed_charge?: number | null;
  per_guest_charge?: number | null;
  SplitRate?: number | null;
  default_staff_cleaning_payout?: number | null;
  default_client_charge?: number | null;
  default_cleaner?: number | null;
  status?: string | null;
  owner?: User;
  photos?: PropertyPhoto[];
  listings?: Listing[];
  created_at?: string;
  updated_at?: string;
}


// ─── Channel Account ──────────────────────────────────────────────────────────
export type ChannelType = 0 | 1 | 2; // 0=Manual, 1=Airbnb, 2=iCal

export const CHANNEL_LABELS: Record<number, string> = {
  0: 'Manual',
  1: 'Airbnb',
  2: 'iCal',
};

export interface ChannelAccount {
  id: number;
  description: string;
  channel_id: ChannelType;
  authentication_token?: string | null;
  authentication_information?: string | null;
  listings_count?: number;
  listings?: Listing[];
  created_at?: string;
  updated_at?: string;
}

export interface SyncResult {
  message?: string;
  error?: string;
  error_detail?: unknown;
  listing: number;
  created_bookings?: number;
  updated_bookings?: number;
  created_cleanings?: number;
  updated_cleanings?: number;
}

// ─── Listing ──────────────────────────────────────────────────────────────────
export interface Listing {
  id: number;
  listing_title?: string | null;
  channel_listing_id?: string | null;
  status?: string | null;
  channel_account_id?: number | null;
  channel_account?: ChannelAccount | null;
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
  guest_id?: number | null;
  status?: string | null;
  planned_checkin_time?: string | null;
  planned_checkout_time?: string | null;
  confirmation_code?: string | null;
  guest?: User | null;
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
  supplies?: SupplyTransaction[];
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

// ─── Supply Transaction ───────────────────────────────────────────────────────
export interface SupplyTransaction {
  id: number;
  supply_id: number;
  supply?: Supply;
  cleaning_id?: number | null;
  type?: string | null;
  amount?: number | null;
  // Backend uses status string: 'not_fulfilled' | 'staged' | 'delivered'
  status?: 'not_fulfilled' | 'staged' | 'delivered' | null;
  created_at?: string;
  updated_at?: string;
}

// ─── Price ────────────────────────────────────────────────────────────────────
export interface Price {
  id: number;
  parent_id?: number | null;
  total?: number | null;
  percentage?: boolean;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}
