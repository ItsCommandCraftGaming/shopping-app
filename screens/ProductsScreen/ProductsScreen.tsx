import useFetch from "@/hooks/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";

export default function ProductsScreen() {
    const router = useRouter();
    const { products } = useLocalSearchParams<{ products?: string }>();
    const { addToCart } = useCart();

    // Fetch products based on the selected category slug
    const { data, loading } = useFetch(
        products
            ? `https://dummyjson.com/products/category/${products}`
            : "https://dummyjson.com/products",
    );

    const productsList = (data as any)?.products || [];

    const renderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                activeOpacity={0.8}
                onPress={() => {
                    router.push({
                        pathname: "/home/[products]/[articles]",
                        params: { products: products || "all", articles: item.id.toString() },
                    });
                }}
            >
                <View style={styles.glassContainer}>
                    {item.thumbnail ? (
                        <Image
                            source={{ uri: item.thumbnail }}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Ionicons
                                name="image-outline"
                                size={40}
                                color="#888"
                            />
                        </View>
                    )}
                    <View style={styles.infoContainer}>
                        <Text style={styles.productTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.productPrice}>${item.price}</Text>
                            <TouchableOpacity
                                style={styles.addToCartSmallBtn}
                                onPress={(e) => {
                                    addToCart({
                                        id: item.id.toString(),
                                        name: item.title,
                                        price: item.price,
                                        category: item.category || "General",
                                        image: item.thumbnail
                                    });
                                }}
                            >
                                <Ionicons name="cart" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ImageBackground
            source={{
                uri: "https://www.everwallpaper.co.uk/cdn/shop/products/11dreamy-pink-paint-mural-wallpaper-plain.jpg?v=1739777834",
            }}
            resizeMode="cover"
            style={styles.container}
        >
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            ) : (
                <FlatList
                    data={productsList}
                    renderItem={renderItem}
                    keyExtractor={(item, index) =>
                        item?.id?.toString() || index.toString()
                    }
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                />
            )}

            {/* Floating Blurred Header */}
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
                            {products || "Products"}
                        </Text>
                    </View>
                </SafeAreaView>
            </View>
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
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000",
        textTransform: "capitalize",
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        paddingTop: 110, // Gives space for the absolute header
        paddingBottom: 120, // Enough space to clear bottom tab bar & safe area
        paddingHorizontal: 8,
    },
    item: {
        flex: 1,
        margin: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
    },
    glassContainer: {
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 1)", // More opaque since it doesn't have blur
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
    },
    productImage: {
        width: "100%",
        height: 150,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 10,
    },
    placeholderImage: {
        width: "100%",
        height: 120,
        backgroundColor: "rgba(255, 255, 255, 1)",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    infoContainer: {
        padding: 12,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1e1e1e",
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "900",
        color: "#007AFF", // Updated to match the blue theme used in ArticlesScreen
    },
    addToCartSmallBtn: {
        backgroundColor: "#1A1A1A",
        borderRadius: 12,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },
});
