import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import {
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

export default function CheckoutScreen() {
    const router = useRouter();
    const { items, contactDetails, calculateTotal, clearCart } = useCart();
    const { showAlert } = useAlert();

    const handleConfirm = () => {
        showAlert({
            title: "Succes!",
            message: `Comanda în valoare de ${calculateTotal()} RON a fost plasată cu succes.`,
            type: "success",
            onConfirm: () => {
                clearCart();
                router.dismissAll();
            }
        });
    };

    if (!contactDetails) {
        return (
            <View style={styles.container}>
                <Text>Nu există detalii de contact.</Text>
            </View>
        );
    }

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
                <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="#000"
                            />
                        </TouchableOpacity>
                        <Text style={styles.title} numberOfLines={1}>
                            Sumar Comandă
                        </Text>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Adresă de livrare</Text>
                    <Text style={styles.detailText}>
                        {contactDetails.fullName}
                    </Text>
                    <Text style={styles.detailText}>
                        {contactDetails.phone}
                    </Text>
                    <Text style={styles.detailText}>
                        {contactDetails.email}
                    </Text>
                    <Text style={styles.detailText}>
                        {contactDetails.address}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Produse ({items.length})
                    </Text>
                    {items.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            {item.image && (
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.itemImage}
                                    resizeMode="contain"
                                />
                            )}
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQuantity}>
                                    Cantitate: {item.quantity}
                                </Text>
                            </View>
                            <Text style={styles.itemPrice}>
                                {item.price * item.quantity} RON
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total de plată</Text>
                    <Text style={styles.totalValue}>
                        {calculateTotal()} RON
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={handleConfirm}
                >
                    <Text style={styles.confirmBtnText}>Confirmă Comanda</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 120,
        paddingBottom: 60,
        paddingHorizontal: 20,
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
    headerSafeArea: {
        paddingBottom: 15,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: 10,
    },
    backButton: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 20,
        padding: 8,
        marginRight: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: "900",
        color: "#1A1A1A",
        flex: 1,
    },
    section: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#1A1A1A",
    },
    detailText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 4,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.05)",
        paddingBottom: 12,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "rgba(255,255,255,0.6)",
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
    },
    itemQuantity: {
        fontSize: 14,
        color: "#7E8A97",
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#007AFF",
    },
    totalSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.1)",
        marginBottom: 24,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    totalValue: {
        fontSize: 22,
        fontWeight: "900",
        color: "#007AFF",
    },
    confirmBtn: {
        backgroundColor: "#1A1A1A",
        borderRadius: 18,
        paddingVertical: 18,
        alignItems: "center",
        marginBottom: 40,
        shadowColor: "#1A1A1A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    confirmBtnText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});
