import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Calendar, Agenda, LocaleConfig } from 'react-native-calendars';
import { getArrayFromStorage, saveArrayStorage } from '../modals/StorageService';
import { Card, Modal, Text, Button } from 'react-native-paper';
import WeekOrgCard from './modals/WeekOrgCard';
import WeekOrgFilter, { SubtitleLine } from './modals/WeekOrgFilter';
import { useFocusEffect } from '@react-navigation/core';
import RecipeScreen from '../Home/Recipe/Recipe';

LocaleConfig.locales['de'] = {
    monthNames: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember'
    ],
    dayNames: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    dayNamesShort: [
        'So',
        'Mo',
        'Di',
        'Mi',
        'Do',
        'Fr',
        'Sa'
    ],

}

LocaleConfig.defaultLocale = 'de';

const getToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Add 1 because January is 0
    const day = ("0" + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
};

const deleteOldRecipes = (recipeJson) => {
    let result = {};
    let currentDate = new Date(); // Das aktuelle Datum
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() - 2;
    let day = currentDate.getDate();
    if (month < 0) {
        month += 12; // Monat wird auf 12 addiert, um korrekten Monat zu erhalten
        year -= 1; // Jahr wird um 1 reduziert
    }
    let date = `${year}-${month}-${day}`;
    for (let key in recipeJson) {
        if (Date.parse(key) > Date.parse(date)) {
            result[key] = recipeJson[key]
        }
    }
    // let filteredData = recipeJson.filter(date => date > MonthAgo); // Nur die Daten filtern, die neuer als ein Monat sind
    return result;
};

export default function CalendarScreen({ navigation }) {
    const [recipes, setRecipes] = React.useState([])
    const [items, setItems] = React.useState({});
    const [selectedDay, setSelectedDay] = React.useState(getToday());
    const [visible, setVisible] = React.useState(false);
    const [card, setCard] = React.useState(false);
    const [selectedRecipe, setSelectedRecipe] = React.useState({});
    const [recipeChanged, setRecipeChanged] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const fetchedRecipes = await getArrayFromStorage('recipes');
                let result = await getArrayFromStorage('@checkedRecipes');
                if (fetchedRecipes) {
                    setRecipes(fetchedRecipes)
                }
                if (result === null) {
                    setItems({});
                } else {
                    setItems(result);
                };
            }
            setSelectedDay(getToday());
            fetchData();
        }, []),);

    React.useEffect(() => {
        if (recipeChanged) {
            saveCheckedRecipes();
            setRecipeChanged(false); // Zurücksetzen des Trigger-Status
        }
    }, [recipeChanged]);

    const saveCheckedRecipes = async () => {
        try {
            await saveArrayStorage('@checkedRecipes', items)
        } catch (error) {
            console.error(error);
        };
    };

    const addRecipe = () => {
        // Ein neues Rezept wird erstellt
        const newRecipe = { recipe: selectedRecipe };
        // Die neuen Rezepte werden in den Zustand gespeichert
        const filteredRecipes = deleteOldRecipes(items);
        setItems({
            ...filteredRecipes,
            [selectedDay]: newRecipe
        });
        setRecipeChanged(true);
    };

    // Funktion zum Löschen eines Rezepts
    const deleteRecipe = (date) => {
        if (items[date]) {
            // Die Rezepte für den gegebenen Tag werden gelöscht
            delete items[date];
            // Die neuen Rezepte werden in den Zustand gespeichert
            setItems({ ...items });
        };
        setRecipeChanged(true);
    };
    const onDayPress = day => {
        setSelectedDay(day.dateString);
    }

    const closeModal = () => {
        setVisible(false)
    }
    const openModal = () => {
        setVisible(true)
    }

    const goToRecipeScreen = (recipe) => {
        // Hier navigieren wir zur "Recipe" Seite
        navigation.navigate('Recipe', { title: recipe.title })
    };

    const markedDates = React.useMemo(() => {
        // Hier die Markierungen für jedes Datum in items erstellen
        const marked = {};
        Object.keys(items).forEach(key => {
            marked[key] = { marked: true };
        });
        return marked;
    }, [items]);


    return (
        <View style={{ flex: 1 }}>
            <Agenda
                firstDay={1}
                selected={getToday()}
                // Die zu zeigenden Elemente
                items={items}

                // Callback, wenn ein Tag geändert wird
                onDayPress={onDayPress}

                // Callback zur Darstellung eines Elements
                // renderItem={(item) => {
                //     console.log(item)
                //     return (<View style={{ backgroundColor: 'red' }}><Text> hiii</Text></View>);
                // }}
                showOnlySelectedDayItems
                markedDates={markedDates}  // Verwenden Sie die markierten Daten
                // Callback zur Darstellung eines leeren Datums
                renderEmptyData={() => {
                    return (
                        <View>
                            <Text variant="headlineLarge" style={styles.recipeText}>Kein Rezept ausgewählt </Text>
                            <Button onPress={() => openModal()} >Rezept hinzufügen</Button>
                        </View>
                    );
                }}
                renderDay={() => {
                    const recipe = items[selectedDay];
                    console.log(recipe.recipe.description.imgUri)
                    return (
                        <View style={{ width: '100%' }}>
                            <Card onPress={() => goToRecipeScreen(recipe.recipe)}>
                                <Text variant="headlineLarge" style={styles.recipeText}>{recipe.recipe.title}</Text>
                                <Card.Cover style={styles.cardImg} source={{ uri: recipe.recipe.description.imgUri }} />
                                <Button onPress={() => deleteRecipe(selectedDay)} >Rezept löschen</Button>
                            </Card>
                        </View>
                    );
                }}
            />
            <Modal style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} visible={visible} onDismiss={closeModal}>
                <WeekOrgFilter recipes={recipes} setSelectedRecipe={setSelectedRecipe} setCard={setCard} />
            </Modal>
            <Modal visible={card} onDismiss={() => setCard(false)}>
                <WeekOrgCard recipe={selectedRecipe} addRecipe={addRecipe} setCard={setCard} setVisible={setVisible} />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    calendarView: {
        height: '40%'
    },
    recipeText: {
        textAlign: 'center'
    },
    cardImg: {
        margin: 16
    }
})