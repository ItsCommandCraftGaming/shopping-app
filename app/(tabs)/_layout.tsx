import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

function TabBarBackground() {
  const pathname = usePathname();
  const isBasket = pathname.includes("basket");

  // Animate the position of the glow container (50% width)
  const sliderStyle = useAnimatedStyle(() => ({
    left: withTiming(isBasket ? "50%" : "0%", {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    }),
  }));

  // Cross-fade the colors inside the slider
  const homeOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(isBasket ? 0 : 1, { duration: 400 }),
  }));

  const basketOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(isBasket ? 1 : 0, { duration: 400 }),
  }));

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BlurView
        intensity={20}
        experimentalBlurMethod="dimezisBlurView"
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 35,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={[
            { position: "absolute", top: 0, bottom: 0, width: "50%" },
            sliderStyle,
          ]}
        >
          <Animated.View style={[StyleSheet.absoluteFillObject, homeOpacity]}>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0)",
                "rgba(100, 150, 255, 0.2)",
                "rgba(255, 255, 255, 0)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>

          <Animated.View style={[StyleSheet.absoluteFillObject, basketOpacity]}>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0)",
                "rgba(255, 100, 100, 0.2)",
                "rgba(255, 255, 255, 0)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </Animated.View>
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 90,
          right: 90,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: 35,
          height: 70,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
          borderTopWidth: 0,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginBottom: 8,
        },
        tabBarItemStyle: {
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#1A1A1A",
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Acasă",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="basket"
        options={{
          title: "Coș",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
