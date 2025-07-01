import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './screens/MapScreen';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style='light' />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#151b22',
            borderTopColor: '#4b4b4b',
            borderTopWidth: 1,
            height: 62,
            display: 'flex',
            paddingTop: 4,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#43b0f1',
          tabBarInactiveTintColor: '#bbb8b8',
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home-sharp' : 'home-outline';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Coach') {
              iconName = focused
                ? 'chatbubble-ellipses'
                : 'chatbubble-ellipses-outline';
            }
            return (
              <Ionicons
                name={iconName as any}
                size={focused ? size - 2 : size - 4}
                color={color}
                style={{
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              />
            );
          },
        })}
      >
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='Map' component={MapScreen} />
        <Tab.Screen name='Coach' component={ChatScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
