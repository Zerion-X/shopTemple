export default interface Review {
  review_id: number;
  rating: number;
  comment: string;
  product_id: number;
  user_id: number;
  created_at: Date;
  updated_at?: Date;
}