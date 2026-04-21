export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  rating?: number;
  stock: number;
  createdAt: string;
  hue?: number;
  colors?: Array<{
    name: string;
    hex: string;
    stock: number;
  }>;
  sizes?: Array<{
    name: string;
    stock: number;
  }>;
  specifications?: any;
}

export interface Category {
  _id: string;
  id: string;
  name: string;
  description?: string;
}

export interface Order {
  _id: string;
  user: string;
  products: Array<{
    product: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  qrCode?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}