import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { AlertContext, AlertOptions } from "./AlertContext";

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState<AlertOptions | null>(null);

    const showAlert = (newOptions: AlertOptions) => {
        setOptions(newOptions);
        setVisible(true);
    };

    const handleConfirm = () => {
        setVisible(false);
        if (options?.onConfirm) {
            options.onConfirm();
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Modal transparent={true} visible={visible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} experimentalBlurMethod="dimezisBlurView" />
                        <View style={styles.modalInner}>
                            <View style={[
                                styles.iconCircle, 
                                options?.type === "error" ? { backgroundColor: "#FF3B30" } : 
                                options?.type === "info" ? { backgroundColor: "#007AFF" } : 
                                { backgroundColor: "#28a745" }
                            ]}>
                                <Ionicons 
                                    name={options?.type === "error" ? "close" : options?.type === "info" ? "information" : "checkmark"} 
                                    size={36} 
                                    color="#FFFFFF" 
                                />
                            </View>
                            <Text style={styles.modalTitle}>{options?.title}</Text>
                            <Text style={styles.modalText}>{options?.message}</Text>
                            <TouchableOpacity style={styles.modalButton} onPress={handleConfirm} activeOpacity={0.8}>
                                <Text style={styles.modalButtonText}>Continuă</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </AlertContext.Provider>
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
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
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
