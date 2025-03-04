import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screen/HomeScreen";
import DetailsScreen from "../screen/DetailsScreen";
import { StatusBar } from "react-native";
import SplashScreen from "../screen/SplashScreen";
import NewsScreen from "../screen/NewsScreen";

// Define type for navigation
export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Splash:undefined;
  News:undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle={'dark-content'}   backgroundColor={"red"}/>
      <Stack.Navigator initialRouteName="News" screenOptions={{ headerShown: false}}>
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
