import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../../hooks/useCart";

export default function CheckoutScreen() {
    const router = useRouter();
    const { items, contactDetails, calculateTotal, clearCart } = useCart();

    const handleConfirm = () => {
        Alert.alert(
            "Succes!",
            `Comanda în valoare de ${calculateTotal()} RON a fost plasată cu succes.`
        );
        clearCart();
        router.dismissAll();
    };

    if (!contactDetails) {
        return (
            <View style={styles.container}>
                <Text>Nu există detalii de contact.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Sumar Comandă</Text>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Adresă de livrare</Text>
                <Text style={styles.detailText}>{contactDetails.fullName}</Text>
                <Text style={styles.detailText}>{contactDetails.phone}</Text>
                <Text style={styles.detailText}>{contactDetails.email}</Text>
                <Text style={styles.detailText}>{contactDetails.address}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Produse ({items.length})</Text>
                {items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        {item.image && (
                            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
                        )}
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemQuantity}>Cantitate: {item.quantity}</Text>
                        </View>
                        <Text style={styles.itemPrice}>{item.price * item.quantity} RON</Text>
                    </View>
                ))}
            </View>

            <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total de plată</Text>
                <Text style={styles.totalValue}>{calculateTotal()} RON</Text>
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>Confirmă Comanda</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F8FA",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1A1A1A",
    },
    section: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
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
        borderBottomColor: "#F2F3F5",
        paddingBottom: 12,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "#F2F3F5",
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
        borderTopColor: "#E1E5EA",
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
        backgroundColor: "#28a745",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 40,
    },
    confirmBtnText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});
