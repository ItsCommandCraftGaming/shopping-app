import { Stack } from "expo-router";
import { CartProvider } from "../context/CartProvider";
import { FavouritesProvider } from "../context/FavouritesProvider";
import { AlertProvider } from "../context/AlertProvider";
import { ThemeProvider } from "../context/ThemeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <FavouritesProvider>
          <CartProvider>
            <Stack>
              <Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />
              <Stack.Screen name="[contact]/index" options={{ headerShown: true, title: "Detalii Livrare" }} />
              <Stack.Screen name="[contact]/[checkout]/index" options={{ headerShown: true, title: "Finalizare Comandă" }} />
            </Stack>
          </CartProvider>
        </FavouritesProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
