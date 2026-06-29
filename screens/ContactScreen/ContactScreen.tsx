import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useCart } from "../../hooks/useCart";

export default function ContactScreen() {
    const router = useRouter();
    const { contactDetails, saveContactDetails } = useCart();

    const [fullName, setFullName] = useState(contactDetails?.fullName || "");
    const [email, setEmail] = useState(contactDetails?.email || "");
    const [phone, setPhone] = useState(contactDetails?.phone || "");
    const [address, setAddress] = useState(contactDetails?.address || "");

    const handleContinue = () => {
        if (!fullName || !email || !phone || !address) {
            Alert.alert("Eroare", "Vă rugăm să completați toate câmpurile.");
            return;
        }
        saveContactDetails({ fullName, email, phone, address });
        router.push("../basket/contact/checkout");
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Detalii Livrare</Text>

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
                <Text style={styles.continueBtnText}>Continuă spre plată</Text>
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
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#7E8A97",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E1E5EA",
        color: "#1A1A1A",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    continueBtn: {
        backgroundColor: "#007AFF",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 40,
    },
    continueBtnText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});
