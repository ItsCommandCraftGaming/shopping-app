import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useCart } from "../../hooks/useCart";

export default function BasketScreen() {
    const router = useRouter();
    const {
        items,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        calculateTotal,
        clearCart,
    } = useCart();

    const handleCheckout = () => {
        if (items.length === 0) {
            Alert.alert(
                "Coș gol",
                "Nu aveți produse în coș pentru a plasa o comandă.",
            );
            return;
        }
        router.push("../basket/contact");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Coșul Meu</Text>
                <Text style={styles.headerSubtitle}>
                    {items.length === 0
                        ? "Fără produse în coș"
                        : `${items.length} produse active`}
                </Text>
            </View>

            {items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Coșul tău este gol 🛒</Text>
                </View>
            ) : (
                <ScrollView style={styles.listContainer}>
                    {items.map((item) => (
                        <View key={item.id} style={styles.cartCard}>
                            {item.image && (
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.cartItemImage}
                                    resizeMode="contain"
                                />
                            )}
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>
                                    {item.name}
                                </Text>
                                <Text style={styles.productCategory}>
                                    {item.category}
                                </Text>
                                <Text style={styles.productPrice}>
                                    {item.price} RON
                                </Text>
                            </View>

                            <View style={styles.controlsContainer}>
                                <View style={styles.quantitySelector}>
                                    <TouchableOpacity
                                        style={styles.quantityBtn}
                                        onPress={() =>
                                            decreaseQuantity(item.id)
                                        }
                                    >
                                        <Text style={styles.quantityBtnText}>
                                            -
                                        </Text>
                                    </TouchableOpacity>

                                    <Text style={styles.quantityText}>
                                        {item.quantity}
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.quantityBtn}
                                        onPress={() =>
                                            increaseQuantity(item.id)
                                        }
                                    >
                                        <Text style={styles.quantityBtnText}>
                                            +
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={() => removeItem(item.id)}
                                >
                                    <Text style={styles.deleteBtnText}>
                                        Șterge
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {items.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total de plată:</Text>
                        <Text style={styles.totalValue}>
                            {calculateTotal()} RON
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.checkoutBtn}
                        onPress={handleCheckout}
                    >
                        <Text style={styles.checkoutBtnText}>
                            Finalizează Comanda
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F8FA",
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#7E8A97",
        marginTop: 4,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 18,
        color: "#7E8A97",
    },
    cartCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cartItemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 12,
        backgroundColor: "#F2F3F5",
    },
    productInfo: {
        flex: 1,
        paddingRight: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    productCategory: {
        fontSize: 12,
        color: "#7E8A97",
        marginBottom: 8,
        textTransform: "uppercase",
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "700",
        color: "#007AFF",
    },
    controlsContainer: {
        alignItems: "flex-end",
    },
    quantitySelector: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F3F5",
        borderRadius: 8,
        padding: 4,
        marginBottom: 10,
    },
    quantityBtn: {
        width: 28,
        height: 28,
        backgroundColor: "#FFFFFF",
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    quantityBtnText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    quantityText: {
        fontSize: 14,
        fontWeight: "600",
        paddingHorizontal: 12,
        color: "#1A1A1A",
    },
    deleteBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    deleteBtnText: {
        fontSize: 13,
        color: "#FF3B30",
        fontWeight: "600",
    },
    footer: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        color: "#7E8A97",
        fontWeight: "500",
    },
    totalValue: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    checkoutBtn: {
        backgroundColor: "#007AFF",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
    },
    checkoutBtnText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});
