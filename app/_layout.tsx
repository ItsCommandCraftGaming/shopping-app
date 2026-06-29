import { Stack } from "expo-router";
import { CartProvider } from "../context/CartProvider";
import { FavouritesProvider } from "../context/FavouritesProvider";

export default function RootLayout() {
  return (
    <FavouritesProvider>
      <CartProvider>
        <Stack>
          <Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />
          <Stack.Screen name="[contact]/index" options={{ headerShown: true, title: "Detalii Livrare" }} />
          <Stack.Screen name="[contact]/[checkout]/index" options={{ headerShown: true, title: "Finalizare Comandă" }} />
        </Stack>
      </CartProvider>
    </FavouritesProvider>
  );
}
