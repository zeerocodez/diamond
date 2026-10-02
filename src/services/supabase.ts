import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Order, Product } from '../types';

export const SUPABASE_PROJECT_REF = 'twcprpnlqgltxgcspeip';
export const SUPABASE_PROJECT_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;
export const SUPABASE_CONFIG_STORAGE_KEY = 'sdb_supabase_config_v1';

export interface SupabaseConfig {
  projectUrl: string;
  projectRef: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const defaultKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || '';
  try {
    const stored = localStorage.getItem(SUPABASE_CONFIG_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        projectUrl: SUPABASE_PROJECT_URL,
        projectRef: SUPABASE_PROJECT_REF,
        anonKey: parsed.anonKey || defaultKey,
      };
    }
  } catch (e) {
    console.error('Failed reading supabase config from storage', e);
  }
  return {
    projectUrl: SUPABASE_PROJECT_URL,
    projectRef: SUPABASE_PROJECT_REF,
    anonKey: defaultKey,
  };
}

export function saveSupabaseConfig(anonKey: string): SupabaseConfig {
  const config = {
    projectUrl: SUPABASE_PROJECT_URL,
    projectRef: SUPABASE_PROJECT_REF,
    anonKey: anonKey.trim(),
  };
  try {
    localStorage.setItem(SUPABASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed writing supabase config to storage', e);
  }
  return config;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.anonKey) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(config.projectUrl, config.anonKey);
  }
  return supabaseInstance;
}

/**
 * Test connectivity with Supabase project
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  tablesFound?: string[];
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      message: 'Supabase Anon Key is not configured yet. Paste your key from the Supabase dashboard API settings.',
    };
  }

  try {
    // Attempt querying the products table
    const { data, error } = await client.from('products').select('id, name').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          connected: true,
          message: 'Connected to Supabase project! Note: The tables (products, orders) have not been created yet. Run the SQL migration in the Supabase SQL editor.',
        };
      }
      return {
        connected: false,
        message: `Supabase Error: ${error.message} (Code: ${error.code})`,
      };
    }

    return {
      connected: true,
      message: 'Successfully connected and verified queries with Supabase PostgreSQL database!',
      tablesFound: ['products'],
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err.message || 'Network connection failed to Supabase.',
    };
  }
}

/**
 * Seed initial Serena Diamond Bespoke products to Supabase
 */
export async function seedProductsToSupabase(products: Product[]): Promise<{
  success: boolean;
  count: number;
  message: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      count: 0,
      message: 'Supabase client not initialized. Please enter your Anon Key first.',
    };
  }

  try {
    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      sizes: p.sizes,
      stock_quantity: p.stock_quantity,
      images: p.images,
      fabric: p.fabric,
    }));

    const { data, error } = await client.from('products').upsert(formatted, { onConflict: 'id' });
    if (error) {
      throw error;
    }

    return {
      success: true,
      count: products.length,
      message: `Successfully seeded ${products.length} luxury products to Supabase products table!`,
    };
  } catch (err: any) {
    return {
      success: false,
      count: 0,
      message: err.message || 'Error inserting products into Supabase',
    };
  }
}

/**
 * Sync an order to Supabase PostgreSQL database
 */
export async function syncOrderToSupabase(order: Order): Promise<{
  synced: boolean;
  message: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      synced: false,
      message: 'Supabase not configured; stored locally.',
    };
  }

  try {
    // 1. Insert order
    const { error: orderError } = await client.from('orders').upsert({
      id: order.id,
      user_id: order.user_id.startsWith('usr_') ? null : order.user_id,
      total_amount: order.total_amount,
      subtotal: order.subtotal,
      shipping_fee: order.shipping_fee,
      shipping_address: order.shipping_address,
      payment_status: order.payment_status,
      order_status: order.order_status,
      payment_method: order.payment_method,
      created_at: order.created_at,
    });

    if (orderError) {
      console.warn('Supabase order insert note:', orderError);
      return { synced: false, message: orderError.message };
    }

    // 2. Insert order items
    const items = order.items.map((it) => ({
      order_id: order.id,
      product_id: it.product_id,
      size: it.size,
      quantity: it.quantity,
      unit_price: it.unit_price,
    }));

    const { error: itemsError } = await client.from('order_items').insert(items);
    if (itemsError) {
      console.warn('Supabase order_items insert note:', itemsError);
    }

    return {
      synced: true,
      message: `Order #${order.id} mirrored into Supabase database.`,
    };
  } catch (err: any) {
    return {
      synced: false,
      message: err.message || 'Failed to sync to Supabase',
    };
  }
}
