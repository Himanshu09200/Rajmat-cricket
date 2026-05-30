import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="start-match" />
        <Stack.Screen name="match/score" />
      </Stack>
    </PaperProvider>
  );
}
