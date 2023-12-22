import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsScreen from './Home/Settings/Settings';
import HomeScreen from './Home/Home';
import BasketScreen from './Basket/Basket';
import AddRecipeScreen from './Home/Recipe/AddRecipe';
import CategoryScreen from './Home/Recipe/Category';
import RecipeScreen from './/Home/Recipe/Recipe';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HeaderRightSet from './Home/Recipe/RecipeScreen/Modal/HeaderRightSet';
import CategoryFilter from './Home/Recipe/CategoryFilter';
import { useTheme } from 'react-native-paper';
import ImagePickerIcon from './Home/Recipe/RecipeScreen/Modal/ImagePicker'
import { DataProvider } from './modals/DataProvider';
import HomeMenu from './Home/HomeMenu';
import WeekOrgNav from './WeekOrg/WeekOrgNav';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();


export default function NavigationBar({ user, setUpdate }) {
    const theme = useTheme();
    const SettingsScreenComponent = () => <SettingsScreen setUpdate={setUpdate} />;
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <DataProvider user={user}>
                    <Tab.Navigator
                        initialRouteName='HomeTab'
                        screenOptions={{
                            headerShown: false,
                            tabBarShowLabel: false,
                            tabBarActiveBackgroundColor: theme.nav,
                            tabBarItemStyle: { borderRadius: 100, height: 50 },
                            tabBarStyle: { height: 50 }
                        }}>
                        <Tab.Screen
                            name="Basket"
                            component={BasketScreen}
                            initialParams={{ user }}
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
                                    headerTitleAlign: 'center',
                                }}>
                                    <HomeStack.Screen
                                        name="Home"
                                        component={HomeScreen}
                                        options={({ route, navigation }) => ({
                                            headerTransparent: true,
                                            headerStyle: { backgroundColor: 'rgba(255,255,255,0.5)' },
                                            title: `${user.username}'s Rezepte`,
                                            headerRight: () => (
                                                <HomeMenu navigation={navigation} />
                                            ),
                                        })}>
                                    </HomeStack.Screen>
                                    <HomeStack.Screen
                                        name="Settings"
                                        component={SettingsScreenComponent}
                                    >
                                    </HomeStack.Screen>
                                    <HomeStack.Screen
                                        name="AddRecipe"
                                        component={AddRecipeScreen}
                                        initialParams={{ user }}
                                        options={({ route }) => ({
                                            title: route.params.title,
                                            headerRight: () => (
                                                <ImagePickerIcon />
                                            )
                                        })}  >
                                    </HomeStack.Screen>
                                    <HomeStack.Screen
                                        name="Category"
                                        component={CategoryScreen}
                                        // initialParams={title}
                                        options={({ route, navigation }) => ({
                                            title: route.params.title,
                                            headerTransparent: true,
                                            headerStyle: { backgroundColor: 'rgba(255,255,255,0.5)' },
                                            headerTitleStyle: { fontFamily: 'Mirabella Demo', fontSize: 36 },
                                            headerRight: () => (
                                                <CategoryFilter openDialog={() => navigation.setParams({ showDialog: true })} />
                                            ),
                                        })}  >
                                    </HomeStack.Screen>
                                    <HomeStack.Screen
                                        name="Recipe"
                                        component={RecipeScreen}
                                        initialParams={{ user }}
                                        options={({ route, navigation }) => ({
                                            title: route.params.title,
                                            headerTitleAlign: 'center',
                                            headerRight: () => (
                                                <HeaderRightSet title={route.params.title} navigation={navigation} />
                                            ),
                                        })}>
                                    </HomeStack.Screen>
                                </HomeStack.Navigator>
                            )}
                        </Tab.Screen>
                        <Tab.Screen
                            name="WeekOrg"
                            component={WeekOrgNav}
                            options={({ route, navigation }) => ({
                                tabBarIcon: ({ tintColor }) => (
                                    // Hier das Icon ändern
                                    <Icon name="calendar-outline" size={25} color={tintColor} />
                                )
                            })} />
                    </Tab.Navigator>
                </DataProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}