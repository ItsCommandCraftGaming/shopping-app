import useFetch from "@/hooks/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ArticlesScreen() {
    const router = useRouter();
    // In the route /home/[products]/[articles], "articles" represents the product ID.
    const { articles } = useLocalSearchParams<{ articles: string }>();

    const { data: product, loading } = useFetch(
        articles ? `https://dummyjson.com/products/${articles}` : "",
    );

    if (loading || !product) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );
    }

    const prod = product as any;

    return (
        <View style={styles.container}>
            <ScrollView
                bounces={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: prod.thumbnail }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    {/* Back Button Floating on Image */}
                    <SafeAreaView
                        style={styles.backButtonSafeArea}
                        edges={["top"]}
                    >
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
                    </SafeAreaView>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{prod.title}</Text>
                        <Text style={styles.price}>${prod.price}</Text>
                    </View>

                    <View style={styles.badgeRow}>
                        <View style={styles.badge}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.badgeText}>{prod.rating}</Text>
                        </View>
                        <View style={styles.badge}>
                            <Ionicons
                                name="cube-outline"
                                size={16}
                                color="#4A90E2"
                            />
                            <Text style={styles.badgeText}>
                                Stoc: {prod.stock}
                            </Text>
                        </View>
                        <View style={styles.badge}>
                            <Ionicons
                                name="pricetag-outline"
                                size={16}
                                color="#E24A4A"
                            />
                            <Text style={styles.badgeText}>
                                {prod.category}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Descriere</Text>
                    <Text style={styles.description}>{prod.description}</Text>

                    <View style={styles.bottomSpacer} />
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="cart-outline"
                        size={24}
                        color="#FFF"
                        style={styles.cartIcon}
                    />
                    <Text style={styles.addToCartText}>Adaugă în Coș</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F8FA",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F8FA",
    },
    scrollContent: {
        paddingBottom: 100, // Space for the bottom bar
    },
    imageContainer: {
        width: width,
        height: width * 1.1, // Slightly taller than square
        backgroundColor: "#E1E5EA",
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    backButtonSafeArea: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    backButton: {
        marginLeft: 16,
        marginTop: 10,
        alignSelf: "flex-start",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 25,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3,
    },
    detailsContainer: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        marginTop: -35, // Pull up over the image
        padding: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 10,
        minHeight: 500, // Ensure it covers the rest of the screen
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    title: {
        flex: 1,
        fontSize: 26,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginRight: 16,
    },
    price: {
        fontSize: 26,
        fontWeight: "900",
        color: "#007AFF",
    },
    badgeRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 28,
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F3F5",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    badgeText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: "600",
        color: "#4A4A4A",
        textTransform: "capitalize",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: "#555",
        lineHeight: 24,
    },
    bottomSpacer: {
        height: 80,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 34, // Safe area for home indicator
        borderTopWidth: 1,
        borderTopColor: "#EAEAEC",
    },
    addToCartButton: {
        backgroundColor: "#1A1A1A",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        paddingVertical: 20,
        shadowColor: "#1A1A1A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    cartIcon: {
        marginRight: 10,
    },
    addToCartText: {
        fontSize: 18,
        fontWeight: "800",
        color: "#FFFFFF",
    },
});
