import useFetch from "@/hooks/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    UIManager,
    PanResponder,
    Animated,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";

if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const { width } = Dimensions.get("window");

export default function ArticlesScreen() {
    const router = useRouter();
    // In the route /home/[products]/[articles], "articles" represents the product ID.
    const { articles } = useLocalSearchParams<{ articles: string }>();
    const insets = useSafeAreaInsets();
    const { addToCart } = useCart();

    const { data: product, loading } = useFetch(
        articles ? `https://dummyjson.com/products/${articles}` : "",
    );

    const [isExpanded, setIsExpanded] = useState(false);
    const expandAnim = React.useRef(new Animated.Value(0)).current;

    // Keep a ref to the current state so the PanResponder can always access the latest value
    const isExpandedRef = React.useRef(isExpanded);
    isExpandedRef.current = isExpanded;

    const toggleAnimation = (expand: boolean) => {
        setIsExpanded(expand);
        Animated.spring(expandAnim, {
            toValue: expand ? 1 : 0,
            useNativeDriver: false,
            friction: 8,
            tension: 60,
        }).start();
    };

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy < -15 && !isExpandedRef.current) {
                    toggleAnimation(true);
                } else if (gestureState.dy > 15 && isExpandedRef.current) {
                    toggleAnimation(false);
                } else if (Math.abs(gestureState.dy) <= 15) {
                    // Treat as tap
                    toggleAnimation(!isExpandedRef.current);
                }
            },
        })
    ).current;

    const contentHeight = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 190], // Fixed height for expanded content
        extrapolate: "clamp",
    });

    const contentOpacity = expandAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1], // Smooth fade in
        extrapolate: "clamp",
    });

    const barPaddingTop = expandAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [4, 0],
        extrapolate: "clamp",
    });

    if (loading || !product) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#000000" />
            </View>
        );
    }

    const prod = product as any;

    return (
        <ImageBackground
            source={{
                uri: "https://www.everwallpaper.co.uk/cdn/shop/products/11dreamy-pink-paint-mural-wallpaper-plain.jpg?v=1739777834",
            }}
            resizeMode="cover"
            style={styles.container}
        >
            <ScrollView
                style={{ flex: 1 }}
                bounces={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: prod.thumbnail }}
                        style={styles.image}
                        resizeMode="cover"
                    />
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

            {/* Fixed Back Button */}
            <SafeAreaView
                style={styles.backButtonSafeArea}
                edges={["top"]}
                pointerEvents="box-none"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Floating Glass Bottom Bar (Crash-Safe) */}
            <View style={styles.bottomBarWrapper}>
                <BlurView
                    intensity={80}
                    tint="light"
                    style={StyleSheet.absoluteFillObject}
                />

                {/* Drag handle */}
                <View 
                    style={styles.dragHandleContainer} 
                    {...panResponder.panHandlers}
                >
                    <View style={styles.dragHandle} />
                </View>

                <Animated.View style={{ height: contentHeight, opacity: contentOpacity, overflow: 'hidden' }}>
                    <View style={styles.expandedContent}>
                        <Text style={styles.expandedTitle}>Sumar Coș</Text>
                        <View style={styles.expandedRow}>
                            <Text style={styles.expandedText}>{prod.title}</Text>
                            <Text style={styles.expandedPrice}>${prod.price}</Text>
                        </View>
                        <View style={styles.expandedRow}>
                            <Text style={styles.expandedText}>Transport estimat</Text>
                            <Text style={styles.expandedPrice}>$5.99</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.expandedRow}>
                            <Text style={styles.totalText}>Total</Text>
                            <Text style={styles.totalPrice}>${(prod.price + 5.99).toFixed(2)}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Inner container gets the dynamic padding */}
                <Animated.View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) + 90, paddingTop: barPaddingTop }]}>
                    <TouchableOpacity
                        style={styles.goToBasketButton}
                        activeOpacity={0.8}
                        onPress={() => router.push("/basket")}
                    >
                        <Ionicons
                            name="basket-outline"
                            size={28}
                            color="#1A1A1A"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        activeOpacity={0.8}
                        onPress={() => {
                            addToCart({
                                id: prod.id.toString(),
                                name: prod.title,
                                price: prod.price,
                                category: prod.category,
                                image: prod.thumbnail
                            });
                        }}
                    >
                        <Text style={styles.addToCartText}>Adaugă în Coș</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        paddingBottom: 200, // Enough space to scroll content above the absolute blurred bottom bar
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
        minHeight: 500, // Ensure it covers the rest of the screen
        // Removed shadows/elevation because they cause Z-index rendering bugs on Android over BlurView
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
    bottomBarWrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0.4)", // Let the blur show through
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 1)",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    bottomBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        gap: 16,
    },
    dragHandleContainer: {
        width: "100%",
        paddingVertical: 16,
        alignItems: "center",
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: "#D1D1D6",
        borderRadius: 3,
    },
    expandedContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    expandedTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 16,
    },
    expandedRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    expandedText: {
        fontSize: 16,
        color: "#555",
        flex: 1,
    },
    expandedPrice: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
    },
    divider: {
        height: 1,
        backgroundColor: "#EAEAEC",
        marginVertical: 12,
    },
    totalText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: "900",
        color: "#007AFF",
    },
    goToBasketButton: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: "#F2F3F5",
        justifyContent: "center",
        alignItems: "center",
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: "#1A1A1A",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        height: 60,
        shadowColor: "#1A1A1A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    addToCartText: {
        fontSize: 18,
        fontWeight: "800",
        color: "#FFFFFF",
    },
});
