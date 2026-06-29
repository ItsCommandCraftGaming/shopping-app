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
import { useTheme } from "../../context/ThemeProvider";

export default function CheckoutScreen() {
    const router = useRouter();
    const { items, contactDetails, calculateTotal, clearCart } = useCart();
    const { showAlert } = useAlert();
    const { isDarkMode } = useTheme();

    const bgImageSource = isDarkMode
        ? require("../../assets/images/dark-mode.png")
        : require("../../assets/images/light-mode.png");

    const textColor = isDarkMode ? "#F0F0F0" : "#1A1A1A";
    const titleColor = isDarkMode ? "#FFFFFF" : "#000000";
    const subTextColor = isDarkMode ? "#AAAAAA" : "#555555";
    const glassBg = isDarkMode ? "rgba(30, 30, 30, 0.7)" : "rgba(255, 255, 255, 1)";
    const glassBorder = isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.8)";
    const iconColor = isDarkMode ? "#FFFFFF" : "#000000";
    const priceColor = isDarkMode ? "#66B2FF" : "#007AFF";
    const buttonBg = isDarkMode ? "#FFFFFF" : "#1A1A1A";
    const buttonIcon = isDarkMode ? "#1A1A1A" : "#FFFFFF";
    const itemDivider = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";

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
            source={bgImageSource}
            resizeMode="cover"
            style={styles.container}
        >
            <View style={styles.headerWrapper}>
                <BlurView
                    intensity={20}
                    tint={isDarkMode ? "dark" : "light"}
                    style={StyleSheet.absoluteFillObject}
                    experimentalBlurMethod="dimezisBlurView"
                />
                <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={[styles.backButton, { backgroundColor: isDarkMode ? "rgba(30, 30, 30, 0.5)" : "rgba(255, 255, 255, 0.5)" }]}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={iconColor}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
                            Sumar Comandă
                        </Text>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={[styles.section, { backgroundColor: glassBg, borderColor: glassBorder }]}>
                    <Text style={[styles.sectionTitle, { color: titleColor }]}>Adresă de livrare</Text>
                    <Text style={[styles.detailText, { color: subTextColor }]}>
                        {contactDetails.fullName}
                    </Text>
                    <Text style={[styles.detailText, { color: subTextColor }]}>
                        {contactDetails.phone}
                    </Text>
                    <Text style={[styles.detailText, { color: subTextColor }]}>
                        {contactDetails.email}
                    </Text>
                    <Text style={[styles.detailText, { color: subTextColor }]}>
                        {contactDetails.address}
                    </Text>
                </View>

                <View style={[styles.section, { backgroundColor: glassBg, borderColor: glassBorder }]}>
                    <Text style={[styles.sectionTitle, { color: titleColor }]}>
                        Produse ({items.length})
                    </Text>
                    {items.map((item) => (
                        <View key={item.id} style={[styles.itemRow, { borderBottomColor: itemDivider }]}>
                            {item.image && (
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.itemImage}
                                    resizeMode="contain"
                                />
                            )}
                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemName, { color: textColor }]}>{item.name}</Text>
                                <Text style={[styles.itemQuantity, { color: subTextColor }]}>
                                    Cantitate: {item.quantity}
                                </Text>
                            </View>
                            <Text style={[styles.itemPrice, { color: priceColor }]}>
                                {item.price * item.quantity} RON
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={[styles.totalSection, { borderTopColor: itemDivider }]}>
                    <Text style={[styles.totalLabel, { color: textColor }]}>Total de plată</Text>
                    <Text style={[styles.totalValue, { color: priceColor }]}>
                        {calculateTotal()} RON
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.confirmBtn, { backgroundColor: buttonBg }]}
                    onPress={handleConfirm}
                >
                    <Text style={[styles.confirmBtnText, { color: buttonIcon }]}>Confirmă Comanda</Text>
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
