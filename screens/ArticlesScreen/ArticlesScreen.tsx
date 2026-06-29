import useFetch from "@/hooks/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeProvider";
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
import { useCart } from "../../hooks/useCart";
import { useFavourites } from "../../hooks/useFavourites";

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
    const { toggleFavourite, isFavourite } = useFavourites();
    const { isDarkMode } = useTheme();

    const bgImageSource = isDarkMode
        ? require("../../assets/images/dark-mode.png")
        : require("../../assets/images/light-mode.png");

    const textColor = isDarkMode ? "#F0F0F0" : "#1A1A1A";
    const subTextColor = isDarkMode ? "#AAAAAA" : "#555555";
    const titleColor = isDarkMode ? "#FFFFFF" : "#000000";
    const detailsBg = isDarkMode ? "rgba(20, 20, 20, 0.95)" : "#FFFFFF";
    const glassBg = isDarkMode ? "rgba(30, 30, 30, 0.7)" : "rgba(255, 255, 255, 0.8)";
    const iconColor = isDarkMode ? "#FFFFFF" : "#1A1A1A";
    const priceColor = isDarkMode ? "#66B2FF" : "#007AFF";
    const buttonBg = isDarkMode ? "#FFFFFF" : "#1A1A1A";
    const buttonIcon = isDarkMode ? "#1A1A1A" : "#FFFFFF";
    const buttonDisabled = isDarkMode ? "#555555" : "#D1D1D6";
    const reviewBg = isDarkMode ? "#2C2C2E" : "#F8F8F8";
    const favBg = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";

    const { data: product, loading } = useFetch(
        articles ? `https://dummyjson.com/products/${articles}` : "",
    );

    const [isExpanded, setIsExpanded] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const onImageScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        if (roundIndex !== activeImageIndex) {
            setActiveImageIndex(roundIndex);
        }
    };

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
            <View style={[styles.loaderContainer, { backgroundColor: isDarkMode ? "#000" : "#FFF" }]}>
                <ActivityIndicator size="large" color={iconColor} />
            </View>
        );
    }

    const prod = product as any;

    return (
        <ImageBackground
            source={bgImageSource}
            resizeMode="cover"
            style={styles.container}
        >
            <ScrollView
                style={{ flex: 1 }}
                bounces={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.imageContainer}>
                    {prod.images && prod.images.length > 0 ? (
                        <View>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={onImageScroll}
                                scrollEventThrottle={16}
                                style={{ width, height: width * 1.1 }}
                            >
                                {prod.images.map((imgUri: string, index: number) => (
                                    <Image
                                        key={index}
                                        source={{ uri: imgUri }}
                                        style={{ width, height: width * 1.1 }}
                                        resizeMode="cover"
                                    />
                                ))}
                            </ScrollView>
                            {prod.images.length > 1 && (
                                <View style={styles.paginationContainer}>
                                    {prod.images.map((_: any, index: number) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.dot,
                                                activeImageIndex === index ? styles.activeDot : {}
                                            ]}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    ) : (
                        <Image
                            source={{ uri: prod.thumbnail }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                </View>

                <View style={[styles.detailsContainer, { backgroundColor: detailsBg }]}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <Text style={[styles.title, { color: titleColor }]}>{prod.title}</Text>
                            {prod.discountPercentage > 0 && (
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>
                                        -{prod.discountPercentage}% REDUCERE
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={[styles.price, { color: priceColor }]}>${prod.price}</Text>
                            {prod.discountPercentage > 0 && (
                                <Text style={styles.oldPrice}>
                                    ${(prod.price / (1 - prod.discountPercentage / 100)).toFixed(2)}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.badgeRow}>
                        <View style={[styles.badge, { backgroundColor: favBg }]}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={[styles.badgeText, { color: textColor }]}>{prod.rating}</Text>
                        </View>
                        <View style={[
                            styles.badge, 
                            prod.availabilityStatus === "Low Stock" ? { backgroundColor: "rgba(255, 149, 0, 0.1)" } : 
                            prod.availabilityStatus === "Out of Stock" ? { backgroundColor: "rgba(255, 59, 48, 0.1)" } : 
                            {}
                        ]}>
                            <Ionicons
                                name={
                                    prod.availabilityStatus === "Low Stock" ? "warning-outline" : 
                                    prod.availabilityStatus === "Out of Stock" ? "alert-circle" : 
                                    "cube-outline"
                                }
                                size={16}
                                color={
                                    prod.availabilityStatus === "Low Stock" ? "#FF9500" : 
                                    prod.availabilityStatus === "Out of Stock" ? "#FF3B30" : 
                                    "#4A90E2"
                                }
                            />
                            <Text style={[
                                styles.badgeText, 
                                prod.availabilityStatus === "Low Stock" ? { color: "#FF9500" } : 
                                prod.availabilityStatus === "Out of Stock" ? { color: "#FF3B30" } : 
                                {}
                            ]}>
                                {prod.availabilityStatus}
                            </Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: favBg }]}>
                            <Ionicons
                                name="pricetag-outline"
                                size={16}
                                color="#E24A4A"
                            />
                            <Text style={[styles.badgeText, { color: textColor }]}>
                                {prod.category}
                            </Text>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { color: titleColor }]}>Descriere</Text>
                    <Text style={[styles.description, { color: subTextColor }]}>{prod.description}</Text>

                    {prod.reviews && prod.reviews.length > 0 && (
                        <View style={styles.reviewsSection}>
                            <Text style={[styles.sectionTitle, { marginTop: 30, marginBottom: 16, color: titleColor }]}>
                                Review-uri ({prod.reviews.length})
                            </Text>
                            {prod.reviews.map((review: any, index: number) => (
                                <View key={index} style={[styles.reviewCard, { backgroundColor: reviewBg }]}>
                                    <View style={styles.reviewHeader}>
                                        <Text style={[styles.reviewerName, { color: textColor }]}>{review.reviewerName}</Text>
                                        <View style={[styles.reviewRating, { backgroundColor: detailsBg }]}>
                                            <Ionicons name="star" size={14} color="#FFD700" />
                                            <Text style={[styles.reviewRatingText, { color: textColor }]}>{review.rating}</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.reviewDate, { color: subTextColor }]}>{new Date(review.date).toLocaleDateString("ro-RO", { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                                    <Text style={[styles.reviewComment, { color: textColor }]}>{review.comment}</Text>
                                </View>
                            ))}
                        </View>
                    )}

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
                    style={[styles.backButton, { backgroundColor: glassBg }]}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={iconColor} />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Floating Glass Bottom Bar (Crash-Safe) */}
            <View style={styles.bottomBarWrapper}>
                <BlurView
                    intensity={80}
                    tint={isDarkMode ? "dark" : "light"}
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
                        <Text style={[styles.expandedTitle, { color: titleColor }]}>Sumar Coș</Text>
                        <View style={styles.expandedRow}>
                            <Text style={[styles.expandedText, { color: textColor }]}>{prod.title}</Text>
                            <Text style={[styles.expandedPrice, { color: textColor }]}>${prod.price}</Text>
                        </View>
                        <View style={styles.expandedRow}>
                            <Text style={[styles.expandedText, { color: textColor }]}>Transport estimat</Text>
                            <Text style={[styles.expandedPrice, { color: textColor }]}>$5.99</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: favBg }]} />
                        <View style={styles.expandedRow}>
                            <Text style={[styles.totalText, { color: titleColor }]}>Total</Text>
                            <Text style={[styles.totalPrice, { color: priceColor }]}>${(prod.price + 5.99).toFixed(2)}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Inner container gets the dynamic padding */}
                <Animated.View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) + 90, paddingTop: barPaddingTop }]}>
                    <TouchableOpacity
                        style={[styles.favButton, { backgroundColor: favBg }]}
                        activeOpacity={0.8}
                        onPress={() => {
                            toggleFavourite({
                                id: prod.id.toString(),
                                name: prod.title,
                                price: prod.price,
                                category: prod.category,
                                image: prod.thumbnail
                            });
                        }}
                    >
                        <Ionicons
                            name={isFavourite(prod.id.toString()) ? "heart" : "heart-outline"}
                            size={28}
                            color={isFavourite(prod.id.toString()) ? "#FF3B30" : iconColor}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.goToBasketButton, { backgroundColor: favBg }]}
                        activeOpacity={0.8}
                        onPress={() => router.navigate("/basket")}
                    >
                        <Ionicons
                            name="basket-outline"
                            size={28}
                            color={iconColor}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.addToCartButton,
                            { backgroundColor: buttonBg },
                            prod.availabilityStatus === "Out of Stock" ? { backgroundColor: buttonDisabled } : {}
                        ]}
                        activeOpacity={0.9}
                        disabled={prod.availabilityStatus === "Out of Stock"}
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
                        <Ionicons name="cart" size={24} color={buttonIcon} />
                        <Text style={[styles.addToCartText, { color: buttonIcon }]}>
                            {prod.availabilityStatus === "Out of Stock" ? "Stoc Epuizat" : "Adaugă în coș"}
                        </Text>
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
    paginationContainer: {
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        marginHorizontal: 4,
    },
    activeDot: {
        width: 20,
        backgroundColor: "#1A1A1A",
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
        fontSize: 26,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    discountBadge: {
        backgroundColor: "rgba(52, 199, 89, 0.15)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: "flex-start",
        marginTop: 6,
    },
    discountText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#28a745",
    },
    price: {
        fontSize: 26,
        fontWeight: "900",
        color: "#007AFF",
    },
    oldPrice: {
        fontSize: 16,
        color: "#8E8E93",
        textDecorationLine: "line-through",
        marginTop: 4,
        textAlign: "right",
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
    reviewsSection: {
        marginTop: 10,
    },
    reviewCard: {
        backgroundColor: "rgba(242, 243, 245, 0.6)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.03)",
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    reviewRating: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    reviewRatingText: {
        fontSize: 12,
        fontWeight: "900",
        marginLeft: 4,
        color: "#1A1A1A",
    },
    reviewDate: {
        fontSize: 12,
        color: "#7E8A97",
        marginBottom: 8,
    },
    reviewComment: {
        fontSize: 14,
        color: "#555",
        lineHeight: 22,
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
    favButton: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: "rgba(255, 59, 48, 0.1)",
        justifyContent: "center",
        alignItems: "center",
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
