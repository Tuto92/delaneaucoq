/**
 * Types & Interfaces for De l'Âne au Coq website
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'entrée' | 'plat' | 'dessert' | 'boisson';
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isHomemade: boolean; // Fait Maison
  allergens: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Reservation {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  specialRequests?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
}

export interface TimeSlot {
  time: string;
  availableCapacity: number;
  totalCapacity: number;
}
