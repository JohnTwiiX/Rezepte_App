import * as React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Overview from './ReceptScreen/Overview';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IngredientsScreen from './ReceptScreen/Ingredients';
import PreparationsScreen from './ReceptScreen/Preparation';


const TabRecept = createMaterialTopTabNavigator();


export default function AddReceptScreen() {
    return (
        <SafeAreaView style={{ height: '100%' }}>
            <TabRecept.Navigator >
                <TabRecept.Screen
                    name='Overview'
                    component={Overview}
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

