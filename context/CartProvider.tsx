import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartContext, CartItem, ContactDetails } from "./CartContext";
import { useAlert } from "../hooks/useAlert";

const CART_STORAGE_KEY = "@cart_items";
const CONTACT_STORAGE_KEY = "@contact_details";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [contactDetails, setContactDetailsState] = useState<ContactDetails | null>(null);
    const { showAlert } = useAlert();

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
        showAlert({
            title: "Adăugat cu succes!",
            message: `${product.name} a fost adăugat în coșul de cumpărături.`,
            type: "success"
        });
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
