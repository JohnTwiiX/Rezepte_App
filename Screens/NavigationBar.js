import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingsScreen from './Settings';
import HomeScreen from './Home';
import BasketScreen from './Basket';
import AddReceptScreen from './AddRecept';
import CategoryScreen from './Category';
import ReceptScreen from './Recept';
import { Button, Dialog, Divider, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';




const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
let deleteRecept = false;
let title = '';

async function deleteReceptStorage(title) {
    try {
        let jsonValue = await AsyncStorage.getItem('recepts');
        if (jsonValue !== null) {
            const recepts = JSON.parse(jsonValue);
            const filteredRecepts = recepts.filter(recept => recept.title !== title);
            // Save the updated array back to AsyncStorage
            // await AsyncStorage.setItem('recepts', JSON.stringify(filteredRecepts));
        }
    } catch (error) {
        console.error(error);
        // Handle error
    };
    deleteRecept = false;
    console.log(deleteRecept);
}

export default function NavigationBar() {
    const [visibleDialog, setVisibleDialog] = React.useState(false);
    const [selectedRecept, setSelectedRecept] = React.useState('');
    const navigation = useNavigation();

    React.useEffect(async () => {
        if (selectedRecept) {
            await deleteReceptStorage(selectedRecept);
        }
        setSelectedRecept('');
        deleteRecept = false;
    }, [deleteRecept === true])

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName='HomeTab'
                    screenOptions={{
                        headerShown: false,
                        tabBarShowLabel: false,
                        tabBarActiveBackgroundColor: '#e1e1e1',
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
                                tabBarShowLabel: false
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
                                    options={{
                                        headerShown: false,
                                    }} >
                                </HomeStack.Screen>
                                <HomeStack.Screen
                                    name="Category"
                                    component={CategoryScreen}
                                    // initialParams={title}
                                    options={({ route }) => ({
                                        title: route.params.title
                                    })}  >
                                </HomeStack.Screen>
                                <HomeStack.Screen
                                    name="Recept"
                                    component={ReceptScreen}
                                    // initialParams={title}
                                    options={({ navigation, route }) => ({
                                        title: route.params.title,
                                        headerRight: () => {
                                            const title = route.params.title;
                                            return (<View style={{ flexDirection: 'row' }}>

                                                <Icon style={{ marginRight: 16 }} name='pencil' size={24} color={'black'} onPress={() => {
                                                    navigation.navigate('AddRecept', { recept: title })
                                                }} />
                                                <Icon name='trash-outline' size={24} color={'black'} onPress={() => {
                                                    setSelectedRecept(title);
                                                    setVisibleDialog(title);
                                                }} />
                                            </View>)
                                        },
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
                < Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)
                }>
                    <Dialog.Content>
                        <Text> Möchtest du das Rezept löschen? </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            deleteRecept = true; setVisibleDialog(false); navigation.navigate('Category', { title: title });
                        }}>Ja</Button>
                        <Button onPress={() => { setSelectedRecept(''); setVisibleDialog(false) }}>Nein</Button>
                    </Dialog.Actions>
                </Dialog >
            </NavigationContainer>
        </SafeAreaProvider>

    )


}