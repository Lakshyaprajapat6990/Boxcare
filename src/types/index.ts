export interface BulkDiscountTier {
  minQuantity: number;
  discountPercent: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  length: number;
  width: number;
  height: number;
  basePrice: number;
  bulkDiscountTiers: BulkDiscountTier[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalProducts: number;
  totalInquiries: number;
  totalReviews: number;
  averageRating: number;
  unreadInquiries: number;
}

export type PageName =
  | 'home'
  | 'products'
  | 'gallery'
  | 'reviews'
  | 'contact'
  | 'admin-login'
  | 'admin-dashboard';

export interface AdminUser {
  username: string;
  role: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  image: string;
  category: string;
  length: number;
  width: number;
  height: number;
  basePrice: number;
  inStock: boolean;
}

export interface ReviewFormData {
  name: string;
  rating: number;
  comment: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}
