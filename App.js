import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LanguageProvider } from './src/context/LanguageContext';
import LandingScreen from './src/screens/LandingScreen';
import HomeMenuScreen from './src/screens/HomeMenuScreen';
import ArchitectureScreen from './src/screens/ArchitectureScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import FoodScreen from './src/screens/FoodScreenNew';

const Stack = createStackNavigator();

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="HomeMenu" component={HomeMenuScreen} />
          <Stack.Screen name="Architecture" component={ArchitectureScreen} />
          <Stack.Screen name="Chatbot" component={ChatbotScreen} />
          <Stack.Screen name="Food" component={FoodScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
