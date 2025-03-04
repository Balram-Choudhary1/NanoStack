import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import SplashScreen from "../screen/SplashScreen";
import NewsScreen from "../screen/NewsScreen";

// Define type for navigation
export type RootStackParamList = {
  Splash:undefined;
  News:undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle={'light-content'}   backgroundColor={"#5252f7"}/>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false}}>
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
