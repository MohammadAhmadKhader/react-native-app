import { SplashScreen, Stack } from "expo-router"
import React, { useEffect } from 'react'
import { useFonts } from 'expo-font';
import { GlobalProvider } from "@/context/GlobalProvider";
import { PaperProvider } from 'react-native-paper';
import { AppRegistry } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import {createDB, dbName} from "@/lib/sqliteDb"
import { appName } from "@/constants";

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [areFontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
    if (areFontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [areFontsLoaded, error])

  if (!areFontsLoaded && !error) {
    return null
  }

  return (
    <GlobalProvider>
      <SQLiteProvider databaseName={dbName} onInit={createDB}>
        <PaperProvider>
          <Stack>
            <Stack.Screen name="index" options={{
              headerShown: false,
            }} />
            <Stack.Screen name="(auth)" options={{
              headerShown: false,
            }} />
            <Stack.Screen name="(tabs)" options={{
              headerShown: false,
            }} />
            <Stack.Screen name="search/[query]" options={{
              headerShown: false,
            }} />
          </Stack>
        </PaperProvider>
      </SQLiteProvider>
    </GlobalProvider>
  )
}

AppRegistry.registerComponent(appName,()=>RootLayout)

export default RootLayout