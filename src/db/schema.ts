/**
 * Database Schema for Serena Diamond Bespoke
 * Compatible with Supabase / Neon (PostgreSQL) and Drizzle ORM
 */

export interface DbUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: Date;
}

export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in NGN (Nigerian Naira)
  category: string;
  sizes: string[]; // ['XS', 'S', 'M', 'L', 'XL']
  stock_quantity: number;
  images: string[];
  fabric: string | null;
  created_at: Date;
}

export interface DbOrder {
  id: string; // e.g. 'SDB-84920'
  user_id: string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  shipping_address: Record<string, any>; // JSON
  payment_status: 'paid' | 'pending' | 'failed';
  order_status: 'pending' | 'tailoring' | 'dispatched' | 'completed';
  payment_method: string;
  created_at: Date;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  size: string;
  quantity: number;
  unit_price: number;
}

/**
 * Standard PostgreSQL Schema Definition
 * (Translates to Drizzle ORM pgTable declarations)
 */
export const SQL_SCHEMA_METADATA = {
  tables: ['users', 'products', 'orders', 'order_items'],
  currency: 'NGN',
  brand: 'Serena Diamond Bespoke',
  location: 'Lagos, Nigeria'
};
