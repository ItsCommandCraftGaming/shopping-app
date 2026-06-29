import { createContext } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    image: string;
}

export interface ContactDetails {
    fullName: string;
    email: string;
    phone: string;
    address: string;
}

export interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    calculateTotal: () => number;
    contactDetails: ContactDetails | null;
    saveContactDetails: (details: ContactDetails) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
