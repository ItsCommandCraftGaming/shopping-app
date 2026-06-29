import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { CartContext, CartItem, ContactDetails } from "./CartContext";

const CART_STORAGE_KEY = "@cart_items";
const CONTACT_STORAGE_KEY = "@contact_details";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [contactDetails, setContactDetailsState] = useState<ContactDetails | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalProduct, setModalProduct] = useState<Omit<CartItem, "quantity"> | null>(null);

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
        setModalProduct(product);
        setModalVisible(true);
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
            <Modal transparent={true} visible={modalVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} experimentalBlurMethod="dimezisBlurView" />
                        <View style={styles.modalInner}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="checkmark" size={36} color="#FFFFFF" />
                            </View>
                            <Text style={styles.modalTitle}>Adăugat cu succes!</Text>
                            <Text style={styles.modalText}>
                                {modalProduct?.name} a fost adăugat în coșul de cumpărături.
                            </Text>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)} activeOpacity={0.8}>
                                <Text style={styles.modalButtonText}>Continuă</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </CartContext.Provider>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        borderRadius: 24,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    modalInner: {
        padding: 24,
        alignItems: "center",
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#28a745",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#28a745",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "900",
        color: "#1A1A1A",
        marginBottom: 10,
        textAlign: "center",
    },
    modalText: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
    },
    modalButton: {
        backgroundColor: "#1A1A1A",
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 32,
        width: "100%",
        alignItems: "center",
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});
