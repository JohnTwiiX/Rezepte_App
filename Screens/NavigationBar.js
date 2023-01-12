import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsScreen from './Settings';
import HomeScreen from './Home';
import BasketScreen from './Basket';
import AddReceptScreen from './AddRecept';
import CategoryScreen from './Category';



const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

export default function NavigationBar() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName='HomeTab'
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveBackgroundColor: 'blue',
                    tabBarItemStyle: { borderRadius: 100 }
                }}>

                <Tab.Screen
                    name="Basket"
                    component={BasketScreen}
                    options={{
                        tabBarIcon: ({ tintColor }) => (
                            // Hier das Icon ändern
                            <Icon name="basket" size={25} color={tintColor} />
                        )
                    }} />
                <Tab.Screen
                    name="HomeTab"
                    // component={HomeScreen}
                    options={{
                        tabBarIcon: ({ tintColor }) => (
                            // Hier das Icon ändern
                            <Icon name="home" size={25} color={tintColor} />
                        )
                    }}>
                    {() => (
                        <HomeStack.Navigator screenOptions={{
                            // headerShown: false,
                            tabBarShowLabel: false
                        }}>
                            <HomeStack.Screen
                                name="Home"
                                component={HomeScreen}
                                options={{
                                    title: "Sandra's Awesome App",
                                }} >
                            </HomeStack.Screen>
                            <HomeStack.Screen
                                name="AddRecept"
                                component={AddReceptScreen}
                                options={{
                                    headerShown: false,
                                }} >
                            </HomeStack.Screen>
                            <HomeStack.Screen
                                name="Category"
                                component={CategoryScreen}
                                options={({ route }) => ({
                                    title: route.params.title
                                })}  >
                            </HomeStack.Screen>
                        </HomeStack.Navigator>
                    )}
                </Tab.Screen>
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarIcon: ({ tintColor }) => (
                            // Hier das Icon ändern
                            <Icon name="settings-outline" size={25} color={tintColor} />
                        )
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}