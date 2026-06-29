import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../hooks/useCart";
import { useAlert } from "../../hooks/useAlert";

export default function ContactScreen() {
    const router = useRouter();
    const { contactDetails, saveContactDetails } = useCart();
    const { showAlert } = useAlert();

    const [fullName, setFullName] = useState(contactDetails?.fullName || "");
    const [email, setEmail] = useState(contactDetails?.email || "");
    const [phone, setPhone] = useState(contactDetails?.phone || "");
    const [address, setAddress] = useState(contactDetails?.address || "");

    const handleContinue = () => {
        if (!fullName || !email || !phone || !address) {
            showAlert({
                title: "Eroare",
                message: "Vă rugăm să completați toate câmpurile.",
                type: "error"
            });
            return;
        }
        saveContactDetails({ fullName, email, phone, address });
        router.push("../basket/contact/checkout");
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
                            Detalii Livrare
                        </Text>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nume complet</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Ion Popescu"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="ion.popescu@exemplu.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Telefon</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="07XX XXX XXX"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Adresă de livrare</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Strada, Număr, Oraș, Județ"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <TouchableOpacity
                    style={styles.continueBtn}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueBtnText}>
                        Continuă spre plată
                    </Text>
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
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
        color: "#1A1A1A",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },
    continueBtn: {
        backgroundColor: "#1A1A1A",
        borderRadius: 18,
        paddingVertical: 18,
        alignItems: "center",
        marginTop: 24,
        marginBottom: 40,
        shadowColor: "#1A1A1A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    continueBtnText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});
