export interface CartItem {
  product_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

export default interface Cart {
  cart_id: number | null;
  updated_at: string | null;
  items: CartItem[];
}
