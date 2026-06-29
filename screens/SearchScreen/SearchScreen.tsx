import useFetch from "@/hooks/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../hooks/useCart";
import { useFavourites } from "../../hooks/useFavourites";

export default function SearchScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const { addToCart } = useCart();
    const { toggleFavourite, isFavourite } = useFavourites();

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery.trim().length >= 3) {
                setDebouncedQuery(searchQuery.trim());
            } else {
                setDebouncedQuery("");
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const { data, loading } = useFetch(
        debouncedQuery.length >= 3
            ? `https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedQuery)}`
            : "",
    );

    const productsList = (data as any)?.products || [];

    const renderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                activeOpacity={0.8}
                onPress={() => {
                    // Navigate to the article screen via home tab stack to maintain navigation history
                    router.navigate({
                        pathname: "/home/[products]/[articles]",
                        params: {
                            products: item.category || "all",
                            articles: item.id.toString(),
                        },
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
                                    <Text style={styles.absoluteDiscountText}>
                                        -{item.discountPercentage}%
                                    </Text>
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
                                <Ionicons
                                    name="star"
                                    size={10}
                                    color="#FFD700"
                                />
                                <Text style={styles.ratingText}>
                                    {item.rating}
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.stockText,
                                    item.availabilityStatus === "Low Stock"
                                        ? { color: "#FF9500" }
                                        : item.availabilityStatus ===
                                            "Out of Stock"
                                          ? { color: "#FF3B30" }
                                          : {},
                                ]}
                            >
                                {item.availabilityStatus || "In Stock"}
                            </Text>
                        </View>

                        <View style={styles.priceRow}>
                            <View>
                                <Text style={styles.productPrice}>
                                    ${item.price}
                                </Text>
                                {item.discountPercentage > 0 && (
                                    <Text style={styles.oldPriceSmall}>
                                        $
                                        {(
                                            item.price /
                                            (1 - item.discountPercentage / 100)
                                        ).toFixed(2)}
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
                                            category:
                                                item.category || "General",
                                            image: item.thumbnail,
                                        });
                                    }}
                                >
                                    <Ionicons
                                        name={
                                            isFavourite(item.id.toString())
                                                ? "heart"
                                                : "heart-outline"
                                        }
                                        size={20}
                                        color={
                                            isFavourite(item.id.toString())
                                                ? "#FF3B30"
                                                : "#1A1A1A"
                                        }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.addToCartSmallBtn,
                                        item.availabilityStatus ===
                                        "Out of Stock"
                                            ? { backgroundColor: "#D1D1D6" }
                                            : {},
                                    ]}
                                    disabled={
                                        item.availabilityStatus ===
                                        "Out of Stock"
                                    }
                                    onPress={(e) => {
                                        addToCart({
                                            id: item.id.toString(),
                                            name: item.title,
                                            price: item.price,
                                            category:
                                                item.category || "General",
                                            image: item.thumbnail,
                                        });
                                    }}
                                >
                                    <Ionicons
                                        name="cart"
                                        size={18}
                                        color="#FFF"
                                    />
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
            {debouncedQuery.length < 3 ? (
                <View style={styles.emptyContainer}>
                    <BlurView
                        intensity={30}
                        tint="light"
                        style={styles.emptyCard}
                        experimentalBlurMethod="dimezisBlurView"
                    >
                        <Ionicons
                            name="search"
                            size={60}
                            color="#1A1A1A"
                            style={{ marginBottom: 16 }}
                        />
                        <Text style={styles.emptyTitle}>Căutare Globală</Text>
                        <Text style={styles.emptySubtitle}>
                            Introdu minim 3 litere pentru a căuta prin absolut
                            toate produsele din magazin.
                        </Text>
                    </BlurView>
                </View>
            ) : loading ? (
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
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <BlurView
                                intensity={30}
                                tint="light"
                                style={styles.emptyCard}
                                experimentalBlurMethod="dimezisBlurView"
                            >
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={60}
                                    color="#1A1A1A"
                                    style={{ marginBottom: 16 }}
                                />
                                <Text style={styles.emptyTitle}>
                                    Niciun rezultat
                                </Text>
                                <Text style={styles.emptySubtitle}>
                                    Nu am găsit niciun produs care să conțină "
                                    {debouncedQuery}".
                                </Text>
                            </BlurView>
                        </View>
                    }
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
                        <Text style={styles.title} numberOfLines={1}>
                            Căutare Globală
                        </Text>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#888" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Caută în tot magazinul..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#888"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery("")}
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color="#888"
                                />
                            </TouchableOpacity>
                        )}
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000",
        flex: 1,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 16,
        paddingHorizontal: 12,
        height: 44,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: "#1A1A1A",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    emptyCard: {
        padding: 30,
        borderRadius: 25,
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
        overflow: "hidden",
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 15,
        color: "#555",
        textAlign: "center",
        lineHeight: 22,
    },
    listContent: {
        paddingTop: 160,
        paddingBottom: 120,
        paddingHorizontal: 8,
        minHeight: "100%",
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
        backgroundColor: "rgba(255, 255, 255, 1)",
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
