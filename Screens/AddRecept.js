import * as React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Overview from './ReceptScreen/Overview';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IngredientsScreen from './ReceptScreen/Ingredients';
import PreparationsScreen from './ReceptScreen/Preparation';
import { useTheme } from 'react-native-paper';


const TabRecept = createMaterialTopTabNavigator();


export default function AddReceptScreen({ route }) {
    const theme = useTheme();
    return (
        <SafeAreaView style={{ height: '100%' }}>
            <TabRecept.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        borderBottomColor: theme.colors.tabColor,
                        borderBottomWidth: 3,
                    }
                }}
            >
                <TabRecept.Screen
                    name='Overview'
                    component={Overview}
                    initialParams={{ recept: route.params ? route.params.recept : route.params }}
                    options={{
                        title: 'Überblick',
                    }} />
                <TabRecept.Screen
                    name='Ingredients'
                    component={IngredientsScreen}
                    options={{
                        title: 'Zutaten',
                    }} />
                <TabRecept.Screen
                    name='Preparation'
                    component={PreparationsScreen}
                    options={{
                        title: 'Zubereitung',
                    }} />
            </TabRecept.Navigator>
        </SafeAreaView>

    );
}

