import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name={"index"} options={{ headerShown: false }} />
      <Stack.Screen name={"[contact]/index"} options={{ headerShown: true, title: "Detalii Livrare" }} />
      <Stack.Screen name={"[contact]/[checkout]/index"} options={{ headerShown: true, title: "Finalizare Comandă" }} />
    </Stack>
  );
}
