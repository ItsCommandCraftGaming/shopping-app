import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

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

interface CartContextType {
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

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "@cart_items";
const CONTACT_STORAGE_KEY = "@contact_details";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [contactDetails, setContactDetailsState] = useState<ContactDetails | null>(null);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            if (storedCart) {
                setItems(JSON.parse(storedCart));
            }
            const storedContact = await AsyncStorage.getItem(CONTACT_STORAGE_KEY);
            if (storedContact) {
                setContactDetailsState(JSON.parse(storedContact));
            }
        } catch (error) {
            console.error("Failed to load from storage", error);
        }
    };

    const saveCart = async (newItems: CartItem[]) => {
        setItems(newItems);
        try {
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
        } catch (error) {
            console.error("Failed to save cart to storage", error);
        }
    };

    const saveContactDetails = async (details: ContactDetails) => {
        setContactDetailsState(details);
        try {
            await AsyncStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(details));
        } catch (error) {
            console.error("Failed to save contact details to storage", error);
        }
    };

    const addToCart = (product: Omit<CartItem, "quantity">) => {
        const existingItem = items.find((item) => item.id === product.id);
        if (existingItem) {
            increaseQuantity(product.id);
        } else {
            saveCart([...items, { ...product, quantity: 1 }]);
        }
        Alert.alert("Adăugat", "Produsul a fost adăugat în coș!");
    };

    const increaseQuantity = (id: string) => {
        const updatedItems = items.map((item) => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        saveCart(updatedItems);
    };

    const decreaseQuantity = (id: string) => {
        const updatedItems = items.map((item) => {
            if (item.id === id && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        saveCart(updatedItems);
    };

    const removeItem = (id: string) => {
        const filteredItems = items.filter((item) => item.id !== id);
        saveCart(filteredItems);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const calculateTotal = () => {
        return items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeItem,
                clearCart,
                calculateTotal,
                contactDetails,
                saveContactDetails,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
