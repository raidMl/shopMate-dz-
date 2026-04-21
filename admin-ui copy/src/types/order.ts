export interface Order {
  _id: string;
  user: string;
  products: OrderProduct[];
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  qrCode?: string;
  createdAt: string;
}

export interface OrderProduct {
  product: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderFormData {
  products: OrderProduct[];
  totalPrice: number;
  status?: string;
}