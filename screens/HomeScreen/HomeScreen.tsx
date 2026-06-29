import useFetch from "@/hooks/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const { data } = useFetch("https://dummyjson.com/products/categories");

    const router = useRouter();
    const [isGridView, setIsGridView] = useState(true);

    const getCategoryIcon = (slug: string): any => {
        switch (slug) {
            case "smartphones":
                return "phone-portrait-outline";
            case "laptops":
                return "laptop-outline";
            case "fragrances":
                return "sparkles-outline";
            case "skincare":
                return "water";
            case "groceries":
                return "nutrition";
            case "home-decoration":
                return "home";
            case "furniture":
                return "bed";
            case "tops":
                return "shirt-outline";
            case "womens-dresses":
                return "woman";
            case "womens-shoes":
                return "footsteps-outline";
            case "mens-shirts":
                return "shirt";
            case "mens-shoes":
                return "footsteps";
            case "mens-watches":
                return "watch";
            case "womens-watches":
                return "watch-outline";
            case "womens-bags":
                return "briefcase-outline";
            case "womens-jewellery":
                return "diamond";
            case "sunglasses":
                return "glasses";
            case "automotive":
                return "car";
            case "motorcycle":
                return "bicycle";
            case "lighting":
                return "bulb";
            case "beauty":
                return "color-wand";
            case "kitchen-accessories":
                return "restaurant";
            case "mobile-accessories":
                return "headset";
            case "skin-care":
                return "water";
            case "sports-accessories":
                return "fitness";
            case "tablets":
                return "tablet-portrait-outline";
            case "vehicle":
                return "car-sport";
            default:
                return "cube";
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        if (!isGridView) {
            return (
                <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => {
                        router.navigate({
                            pathname: "/home/[products]",
                            params: { products: item.slug },
                        });
                    }}
                >
                    <View style={styles.glassContainerList}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons
                                name={getCategoryIcon(item.slug)}
                                size={24}
                                color="#1A1A1A"
                                style={{ marginRight: 12 }}
                            />
                            <Text style={styles.itemTextList}>{item.name}</Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#888"
                        />
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => {
                    router.navigate({
                        pathname: "/home/[products]",
                        params: { products: item.slug },
                    });
                }}
            >
                <View style={styles.glassContainer}>
                    <Ionicons
                        name={getCategoryIcon(item.slug)}
                        size={32}
                        color="#1A1A1A"
                        style={{ marginBottom: 12 }}
                    />
                    <Text style={styles.itemText}>{item.name}</Text>
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
            {/* List scrolls under the header */}
            <FlatList
                data={data}
                renderItem={renderItem}
                key={isGridView ? "grid" : "list"}
                keyExtractor={(item) => item.slug}
                numColumns={isGridView ? 2 : 1}
                contentContainerStyle={styles.listContent}
            />

            {/* Floating Blurred Header */}
            <View style={styles.headerWrapper}>
                <BlurView
                    intensity={20}
                    style={StyleSheet.absoluteFillObject}
                    experimentalBlurMethod="dimezisBlurView"
                />
                <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>Categorii</Text>
                        <TouchableOpacity
                            onPress={() => setIsGridView(!isGridView)}
                            style={styles.viewToggleBtn}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={isGridView ? "list" : "grid"}
                                size={22}
                                color="#000"
                            />
                        </TouchableOpacity>
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
        borderBottomColor: "rgba(255, 255, 255, 1)",
        overflow: "hidden",
    },
    headerSafeArea: {
        paddingBottom: 20,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000000",
    },
    viewToggleBtn: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 20,
        padding: 8,
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
        paddingVertical: 25,
        paddingHorizontal: 15,
        borderRadius: 20,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 1)", // More opaque since it doesn't have blur
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
    },
    itemText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2C3E50",
        textAlign: "center",
        textTransform: "capitalize",
    },
    listItem: {
        width: "100%",
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    glassContainerList: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
    },
    itemTextList: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2C3E50",
        textTransform: "capitalize",
    },
});
