import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsScreen from './Settings/Settings';
import HomeScreen from './Home/Home';
import BasketScreen from './Basket/Basket';
import AddReceptScreen from './Home/Recept/AddRecept';
import CategoryScreen from './Home/Recept/Category';
import ReceptScreen from './/Home/Recept/Recept';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HeaderRightSet from './Home/Recept/ReceptScreen/Modal/HeaderRightSet';
import CategoryFilter from './Home/Recept/CategoryFilter';
import { useTheme } from 'react-native-paper';
import ImagePickerIcon from './Home/Recept/ReceptScreen/Modal/ImagePicker'
import { DataProvider } from './modals/DataProvider';
import EditMode from './Home/Bubbles/EditMode'

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();


export default function NavigationBar({ username }) {
    const theme = useTheme();
    return (
        <SafeAreaProvider>
            <NavigationContainer>
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
                            <DataProvider>
                                <HomeStack.Navigator screenOptions={{
                                    // headerShown: false,
                                    tabBarShowLabel: false,
                                    headerTitleAlign: 'center'
                                }}>
                                    <HomeStack.Screen
                                        name="Home"
                                        component={HomeScreen}
                                        options={({ route, navigation }) => ({
                                            headerTransparent: true,
                                            headerStyle: { backgroundColor: 'rgba(255,255,255,0.5)' },
                                            title: `${username}'s Rezepte`,
                                            headerRight: () => (
                                                <EditMode />
                                            ),
                                        })}>
                                    </HomeStack.Screen>
                                    <HomeStack.Screen
                                        name="AddRecept"
                                        component={AddReceptScreen}
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
                                        })}>
                                    </HomeStack.Screen>
                                </HomeStack.Navigator>
                            </DataProvider>
                        )}
                    </Tab.Screen>
                    <Tab.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{
                            tabBarIcon: ({ tintColor }) => (
                                // Hier das Icon ändern
                                <Icon name="settings" size={25} color={tintColor} />
                            )
                        }} />
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

// function AddReceptScreenWrapper() {
//     return (
//         <DataProvider recept={recept} chip={chip}>
//             <AddReceptScreen />
//         </DataProvider>
//     );
// }