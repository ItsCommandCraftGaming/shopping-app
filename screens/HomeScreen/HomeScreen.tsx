import useFetch from "@/hooks/useFetch";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
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

    const renderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => {
                    router.push({
                        pathname: "/home/[products]",
                        params: { products: item.slug },
                    });
                }}
            >
                <View style={styles.glassContainer}>
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
                keyExtractor={(item) => item.slug}
                numColumns={2}
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
                    <Text style={styles.title}>Categorii</Text>
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
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000000",
        marginHorizontal: 16,
        marginTop: 10,
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
});
