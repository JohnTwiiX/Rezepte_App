import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsScreen from './Settings';
import HomeScreen from './Home';
import BasketScreen from './Basket';
import AddReceptScreen from './AddRecept';
import CategoryScreen from './Category';
import ReceptScreen from './Recept';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HeaderRightSet from './modals/HeaderRightSet';
import CategoryFilter from './modals/CategoryFilter';
import { useTheme } from 'react-native-paper';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();


export default function NavigationBar() {
    const theme = useTheme();
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName='HomeTab'
                    screenOptions={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarActiveBackgroundColor: theme.colors.color,
                        tabBarItemStyle: { borderRadius: 100, height: 50 },
                        tabBarStyle: { height: 50 }
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
                                tabBarShowLabel: false,
                                headerTitleAlign: 'center'
                            }}>
                                <HomeStack.Screen
                                    name="Home"
                                    component={HomeScreen}
                                    options={{
                                        title: "Sandra's Awesome Rezepte App",
                                    }} >
                                </HomeStack.Screen>
                                <HomeStack.Screen
                                    name="AddRecept"
                                    component={AddReceptScreen}
                                    options={({ route }) => ({
                                        title: route.params.title,
                                    })}  >
                                </HomeStack.Screen>
                                <HomeStack.Screen
                                    name="Category"
                                    component={CategoryScreen}
                                    // initialParams={title}
                                    options={({ route, navigation }) => ({
                                        title: route.params.title,
                                        headerRight: () => (
                                            <CategoryFilter openDialog={() => navigation.setParams({ showDialog: true })} />
                                        ),
                                    })}  >
                                </HomeStack.Screen>
                                <HomeStack.Screen
                                    name="Recept"
                                    component={ReceptScreen}
                                    options={({ route, navigation }) => ({
                                        title: route.params.title,
                                        headerTitleAlign: 'center',
                                        headerRight: () => (
                                            <HeaderRightSet title={route.params.title} navigation={navigation} />
                                        ),
                                    })}
                                >
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
        </SafeAreaProvider>
    )
}