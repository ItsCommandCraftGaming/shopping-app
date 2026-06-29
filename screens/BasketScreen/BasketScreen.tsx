import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../hooks/useCart";
import { useAlert } from "../../hooks/useAlert";

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
    const { showAlert } = useAlert();

    const handleCheckout = () => {
        if (items.length === 0) {
            showAlert({
                title: "Coș gol",
                message: "Nu aveți produse în coș pentru a plasa o comandă.",
                type: "info"
            });
            return;
        }
        router.push("../basket/contact");
    };

    return (
        <ImageBackground
            source={{
                uri: "https://www.everwallpaper.co.uk/cdn/shop/products/11dreamy-pink-paint-mural-wallpaper-plain.jpg?v=1739777834",
            }}
            resizeMode="cover"
            style={styles.container}
        >
            <View style={styles.headerWrapper}>
                <BlurView
                    intensity={20}
                    tint="light"
                    style={StyleSheet.absoluteFillObject}
                    experimentalBlurMethod="dimezisBlurView"
                />
                <SafeAreaView edges={["top"]}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Coșul Meu</Text>
                        <Text style={styles.headerSubtitle}>
                            {items.length === 0
                                ? "Fără produse în coș"
                                : `${items.length} produse active`}
                        </Text>
                    </View>
                </SafeAreaView>
            </View>

            {items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyCardWrapper}>
                        <BlurView
                            intensity={20}
                            tint="light"
                            style={StyleSheet.absoluteFillObject}
                            experimentalBlurMethod="dimezisBlurView"
                        />
                        <Ionicons
                            name="cart-outline"
                            size={64}
                            color="#1A1A1A"
                            style={{ marginBottom: 16 }}
                        />
                        <Text style={styles.emptyText}>Coșul tău este gol</Text>
                        <Text style={styles.emptySubtext}>
                            Adaugă produse pentru a continua!
                        </Text>
                    </View>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContent}>
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
                <View style={styles.footerWrapper}>
                    <BlurView
                        intensity={80}
                        tint="light"
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>
                                Total de plată:
                            </Text>
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
                </View>
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.4)",
        overflow: "hidden",
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "900",
        color: "#1A1A1A",
    },
    headerSubtitle: {
        fontSize: 15,
        color: "#555",
        marginTop: 4,
        fontWeight: "500",
    },
    listContent: {
        paddingTop: 130, // space for header
        paddingBottom: 220, // space for footer and tab bar
        paddingHorizontal: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyCardWrapper: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        borderRadius: 30,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.6)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    emptyText: {
        fontSize: 20,
        color: "#1A1A1A",
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 15,
        color: "#1A1A1A",
        fontWeight: "500",
        textAlign: "center",
    },
    cartCard: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderWidth: 1,
        borderColor: "rgba(204, 203, 203, 0.8)",
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    cartItemImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
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
    footerWrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 1)",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    footer: {
        padding: 24,
        paddingBottom: 110, // give space for floating tab bar
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
        backgroundColor: "#1A1A1A",
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: "center",
        shadowColor: "#1A1A1A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    checkoutBtnText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});
