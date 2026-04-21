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

export interface ProductFormData {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  stock: number;
}