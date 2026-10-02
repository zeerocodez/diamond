export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '1X' | '2X' | '3X' | '4X';

export type ProductCategory = 
  | 'All'
  | 'Curated Plus & Silhouette'
  | 'African Heritage Tailoring'
  | 'Tailored Blazers'
  | 'Sheath Dresses'
  | 'Power Suits'
  | 'Luxury Trousers & Silk';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  title?: string;
  organization?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in NGN (Nigerian Naira)
  category: 'Tailored Blazers' | 'Sheath Dresses' | 'Power Suits' | 'Luxury Trousers & Silk' | 'African Heritage Tailoring' | 'Curated Plus & Silhouette';
  sizes: ClothingSize[];
  stock_quantity: number;
  images: string[];
  fabric: string;
  cut: string;
  care: string;
  features: string[];
  inStock: boolean;
  isPlusCollection?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  size: ClothingSize;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  area: string; // e.g. "Victoria Island", "Ikoyi", "Lekki Phase 1", "Ikeja GRA", "Maitama Abuja"
  stateOrCity: string;
  deliveryNotes?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  size: ClothingSize;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string; // e.g. SDB-84920
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  shipping_address: ShippingAddress;
  payment_status: 'paid' | 'pending' | 'failed';
  order_status: 'pending' | 'tailoring' | 'dispatched' | 'delivered' | 'completed';
  payment_method: string;
  mailgun_status?: 'sent' | 'simulated' | 'failed';
  mailgun_message_id?: string;
  created_at: string;
  items: OrderItem[];
}
