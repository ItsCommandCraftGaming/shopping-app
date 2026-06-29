import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />
        <Stack.Screen name="[contact]/index" options={{ headerShown: true, title: "Detalii Livrare" }} />
        <Stack.Screen name="[contact]/[checkout]/index" options={{ headerShown: true, title: "Finalizare Comandă" }} />
      </Stack>
    </CartProvider>
  );
}
