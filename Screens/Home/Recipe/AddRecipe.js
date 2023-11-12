import * as React from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Overview from './RecipeScreen/Overview';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IngredientsScreen from './RecipeScreen/Ingredients';
import PreparationsScreen from './RecipeScreen/Preparation';
import { useTheme } from 'react-native-paper';
import { useData } from '../../modals/DataProvider';



const TabRecipe = createMaterialTopTabNavigator();




export default function AddRecipeScreen({ route }) {
    const theme = useTheme();
    const { setRecipe, setChip } = useData();
    const recipe = route.params.recipe;
    const chip = route.params.chip;
    React.useEffect(() => {
        if (recipe) {
            setRecipe(recipe);
        };
        if (chip) {
            setChip(chip);
        };
    }, [])



    return (
        <SafeAreaView style={{ height: '100%' }}>
            <TabRecipe.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        borderBottomColor: theme.tabColor,
                        borderBottomWidth: 3,
                    }
                }}
            >
                <TabRecipe.Screen
                    name='Overview'
                    component={Overview}
                    options={{
                        title: 'Überblick',
                    }} />
                <TabRecipe.Screen
                    name='Ingredients'
                    component={IngredientsScreen}
                    options={{
                        title: 'Zutaten',
                    }} />
                <TabRecipe.Screen
                    name='Preparation'
                    component={PreparationsScreen}
                    options={{
                        title: 'Zubereitung',
                    }} />
            </TabRecipe.Navigator>
        </SafeAreaView>

    );
}

