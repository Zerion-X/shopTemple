export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export default interface Order {
  order_id: number;
  total_amount: number;
  shipping_address: string;
  status: OrderStatus;
  created_at: string;
  items_count: number;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export interface AdminOrder extends Omit<Order, "items_count"> {
  user_id: number;
  full_name: string;
  email: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price_per_unit: number;
  name: string;
  image_url: string | null;
}

export interface OrderDetails {
  order_id: number;
  user_id: number;
  total_amount: number;
  shipping_address: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderResponse {
  message: string;
  order_id: number;
  total_amount: number;
}