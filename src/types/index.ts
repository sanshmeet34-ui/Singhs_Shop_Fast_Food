export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  spice_level: string;
  ingredients: string;
  taste: string;
  portion: string;
  customizations: Customization[];
}

export interface Customization {
  name: string;
  price: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  badge: string;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  customizations: Customization[];
  unitPrice: number;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  delivery_charge: number;
  grand_total: number;
  customer_name: string;
  mobile_number: string;
  delivery_address: string;
  landmark: string;
  payment_method: string;
  estimated_delivery: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  image: string;
  price: number;
  quantity: number;
  customizations: Customization[];
}

export interface Address {
  id: string;
  label: string;
  full_address: string;
  landmark: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  phone: string;
}

export const CATEGORIES = [
  'Burgers',
  'Pizza',
  'Wraps',
  'Fries',
  'Sandwiches',
  'Snacks',
  'Cold Drinks',
  'Desserts',
] as const;

export const ORDER_STATUSES = [
  'Order Received',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Delivered',
] as const;
