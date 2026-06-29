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
import { useCart } from "../../hooks/useCart";
import { useFavourites } from "../../hooks/useFavourites";

export default function ProductsScreen() {
    const router = useRouter();
    const { products } = useLocalSearchParams<{ products?: string }>();
    const { addToCart } = useCart();
    const { toggleFavourite, isFavourite } = useFavourites();

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
                        <View style={{ position: "relative" }}>
                            <Image
                                source={{ uri: item.thumbnail }}
                                style={styles.productImage}
                                resizeMode="contain"
                            />
                            {item.discountPercentage > 0 && (
                                <View style={styles.absoluteDiscount}>
                                    <Text style={styles.absoluteDiscountText}>-{item.discountPercentage}%</Text>
                                </View>
                            )}
                        </View>
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
                        
                        <View style={styles.metaRow}>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={10} color="#FFD700" />
                                <Text style={styles.ratingText}>{item.rating}</Text>
                            </View>
                            <Text style={[
                                styles.stockText, 
                                item.availabilityStatus === "Low Stock" ? { color: "#FF9500" } : 
                                item.availabilityStatus === "Out of Stock" ? { color: "#FF3B30" } : 
                                {}
                            ]}>
                                {item.availabilityStatus || "In Stock"}
                            </Text>
                        </View>

                        <View style={styles.priceRow}>
                            <View>
                                <Text style={styles.productPrice}>${item.price}</Text>
                                {item.discountPercentage > 0 && (
                                    <Text style={styles.oldPriceSmall}>
                                        ${(item.price / (1 - item.discountPercentage / 100)).toFixed(2)}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={styles.favSmallBtn}
                                    onPress={(e) => {
                                        toggleFavourite({
                                            id: item.id.toString(),
                                            name: item.title,
                                            price: item.price,
                                            category: item.category || "General",
                                            image: item.thumbnail
                                        });
                                    }}
                                >
                                    <Ionicons name={isFavourite(item.id.toString()) ? "heart" : "heart-outline"} size={20} color={isFavourite(item.id.toString()) ? "#FF3B30" : "#1A1A1A"} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.addToCartSmallBtn, item.availabilityStatus === "Out of Stock" ? { backgroundColor: "#D1D1D6" } : {}]}
                                    disabled={item.availabilityStatus === "Out of Stock"}
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
        color: "#007AFF", 
    },
    oldPriceSmall: {
        fontSize: 12,
        color: "#8E8E93",
        textDecorationLine: "line-through",
        marginTop: 2,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    ratingBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.05)",
    },
    ratingText: {
        fontSize: 10,
        fontWeight: "bold",
        marginLeft: 2,
        color: "#1A1A1A",
    },
    stockText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#4A90E2",
    },
    absoluteDiscount: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#FF3B30",
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 8,
    },
    absoluteDiscountText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "bold",
    },
    actionButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    favSmallBtn: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
        backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: 12,
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
