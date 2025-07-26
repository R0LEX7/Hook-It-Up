
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import '../global.css';

console.log("Root layout mounted");


export default function RootLayout() {


  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceGroteskSemiBold: require('../assets/fonts/SpaceGrotesk-SemiBold.ttf'),
    SpaceGroteskBold: require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    SpaceGroteskMedium: require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <Slot />

      <Toast />
      <StatusBar hidden style= {colorScheme === "dark" ? "dark" : "light"} />
    </ThemeProvider>
  );
}
