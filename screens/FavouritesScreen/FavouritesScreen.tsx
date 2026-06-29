import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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
import { useFavourites } from "../../hooks/useFavourites";

export default function FavouritesScreen() {
    const { favourites, toggleFavourite } = useFavourites();
    const { addToCart } = useCart();

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
                <SafeAreaView edges={["top"]}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Favorite</Text>
                        <Text style={styles.headerSubtitle}>
                            {favourites.length === 0
                                ? "Nu ai produse favorite"
                                : `${favourites.length} produse salvate`}
                        </Text>
                    </View>
                </SafeAreaView>
            </View>

            {favourites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyCardWrapper}>
                        <BlurView
                            intensity={20}
                            tint="light"
                            style={StyleSheet.absoluteFillObject}
                            experimentalBlurMethod="dimezisBlurView"
                        />
                        <Ionicons
                            name="heart-outline"
                            size={64}
                            color="#1A1A1A"
                            style={{ marginBottom: 16 }}
                        />
                        <Text style={styles.emptyText}>
                            Lista ta de favorite este goală
                        </Text>
                    </View>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContent}>
                    {favourites.map((item) => (
                        <View key={item.id} style={styles.card}>
                            {item.image && (
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            )}
                            <View style={styles.info}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.category}>
                                    {item.category}
                                </Text>
                                <Text style={styles.price}>
                                    {item.price} RON
                                </Text>
                            </View>
                            <View style={styles.controls}>
                                <TouchableOpacity
                                    onPress={() => toggleFavourite(item)}
                                    style={styles.iconBtn}
                                >
                                    <Ionicons
                                        name="heart"
                                        size={28}
                                        color="#FF3B30"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => addToCart(item)}
                                    style={styles.cartBtn}
                                >
                                    <Ionicons
                                        name="cart-outline"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
    header: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 10,
    },
    headerTitle: { fontSize: 32, fontWeight: "900", color: "#1A1A1A" },
    headerSubtitle: {
        fontSize: 15,
        color: "#555",
        marginTop: 4,
        fontWeight: "500",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyCardWrapper: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        borderRadius: 30,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.6)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    emptyText: {
        fontSize: 18,
        color: "#1A1A1A",
        fontWeight: "700",
        textAlign: "center",
    },
    listContent: {
        paddingTop: 130,
        paddingBottom: 150,
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
    },
    info: { flex: 1, paddingRight: 10 },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    category: {
        fontSize: 12,
        color: "#7E8A97",
        marginBottom: 8,
        textTransform: "uppercase",
    },
    price: { fontSize: 16, fontWeight: "700", color: "#007AFF" },
    controls: { alignItems: "center", justifyContent: "space-between" },
    iconBtn: { padding: 4, marginBottom: 8 },
    cartBtn: {
        backgroundColor: "#1A1A1A",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
});
