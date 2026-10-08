export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export type PaymentMethod = string | number;

export interface Product {
  readonly id: number;
  title: string;
  price: number;
  isAvailable: boolean;
  colors: string[];
  description?: string;
  manufacturer: {
    country: string;
    city: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Admin extends User {
  role: 'admin';
  banUser(username: string): void;
}
