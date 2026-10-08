import { Product, Admin } from '../types';

export const categories: string[] = ["Electronics", "Clothes"];

export const myProduct: Product = {
  id: 1,
  title: 'Виноград Кардинал',
  price: 165,
  isAvailable: true,
  colors: ['черный', 'фиолетовый'],
  description: 'Свежий и сладкий столовый виноград',
  manufacturer: {
    country: 'Узбекистан',
    city: 'Фергана'
  }
};

export interface MarketProduct extends Product {
  image: string;
  unit: string;
}

export const globusProducts: MarketProduct[] = [
  {
    ...myProduct,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXvtTYgIpsh8oT7ySTJ6bcFUy-Upf0y8-BwBE8ah3YfA&s=10',
    unit: '/кг'
  },
  {
    id: 2,
    title: 'Персики вес',
    price: 90,
    isAvailable: true,
    colors: ['оранжевый', 'красный'],
    description: 'Сочные отборные персики первой категории',
    manufacturer: {
      country: 'Кыргызстан',
      city: 'Баткен'
    },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ15s3RPKzKm-zEKzwaEqD4_x-wHSrmQoHXdJil-GSi4g&s=10',
    unit: '/кг'
  },
  {
    id: 3,
    title: 'Бананы сладкие',
    price: 179,
    isAvailable: true,
    colors: ['желтый'],
    description: 'Сладкие спелые бананы высшего сорта из Эквадора',
    manufacturer: {
      country: 'Эквадор',
      city: 'Гуаякиль'
    },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5bwTekgVDmDdeNRQTgdQvYIsJhYnVaZH0v4660WYevQ&s=10',
    unit: '/кг'
  },
  {
    id: 4,
    title: 'Апельсины вес',
    price: 240,
    isAvailable: true,
    colors: ['оранжевый'],
    description: 'Сочные апельсины богатые витамином C',
    manufacturer: {
      country: 'Египет',
      city: 'Каир'
    },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZOCNXYEWWU6jFfL7dC3V62D_0E12uFKLZ8D_6Bs8MHg&s=10',
    unit: '/кг'
  },
  {
    id: 5,
    title: 'Яблоки превосходные',
    price: 85,
    isAvailable: true,
    colors: ['желтый', 'зеленый'],
    description: 'Хрустящие сладкие яблоки сорта Голден',
    manufacturer: {
      country: 'Кыргызстан',
      city: 'Иссык-Куль'
    },
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD9Ud62hEy8ldf-ou3AXHDnBIW13U-fl1Qm5FRx5Y9-g&s',
    unit: '/кг'
  }
];

export const superAdmin: Admin = {
  id: 101,
  name: 'ЖАКШЫЛЫК',
  email: 'admin@globus.market.kg',
  role: 'admin',
  banUser(username: string): void {
    console.log(`Пользователь ${username} заблокирован`);
  }
};

superAdmin.banUser('spammer_123');
