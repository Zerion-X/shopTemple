export default interface Product {
  product_id: number;
  name: string;
  description: string | null;
  price: number;
  created_at: string;
  brand_id: number;
  category_id: number;
  image_url: string | null;
}
