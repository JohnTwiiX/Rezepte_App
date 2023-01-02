import * as React from 'react';
import { Button, Text, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from './Screens/NavigationBar';





export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, }}>
      <NavigationBar />
    </SafeAreaView>
  );
}
















// const HomeStack = createNativeStackNavigator();

// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator>
//       <HomeStack.Screen name="Home" component={HomeScreen} />
//       <HomeStack.Screen name="Details" component={DetailsScreen} />
//     </HomeStack.Navigator>
//   );
// }

// const AddReceptStack = createNativeStackNavigator();

// function AddReceptStackScreen() {
//   return (
//     <AddReceptStack.Navigator>
//       <AddReceptStack.Screen name="Settings" component={SettingsScreen} />
//       <AddReceptStack.Screen name="Details" component={DetailsScreen} />
//     </AddReceptStack.Navigator>
//   );
// }
// const BasketStack = createNativeStackNavigator();

// function BasketStackScreen() {
//   return (
//     <BasketStack.Navigator>
//       <BasketStack.Screen name="Home" component={HomeScreen} />
//       <BasketStack.Screen name="Details" component={DetailsScreen} />
//     </BasketStack.Navigator>
//   );
// }

// const SettingsStack = createNativeStackNavigator();

// function SettingsStackScreen() {
//   return (
//     <SettingsStack.Navigator screenOptions={{ headerShow: false }}>
//       <SettingsStack.Screen name="Settings" component={SettingsScreen} />
//       <SettingsStack.Screen name="Details" component={DetailsScreen} />
//     </SettingsStack.Navigator>
//   );
// }