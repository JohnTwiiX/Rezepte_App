import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { getArrayFromStorage, saveArrayStorage } from '../modals/StorageService';
import { Modal, Text, Button, Divider, Avatar } from 'react-native-paper';
import WeekOrgCard from './modals/WeekOrgCard';
import WeekOrgFilter from './modals/WeekOrgFilter';
import { useFocusEffect } from '@react-navigation/core';

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

function getCurrentWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sonntag) bis 6 (Samstag)

    // Um die Differenz zwischen dem aktuellen Tag und Montag zu berechnen
    const diff = currentDay - 1 + (currentDay === 0 ? 6 : 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - diff); // Montag der aktuellen Woche

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        weekDates.push(formatDate(currentDate));
    }

    return weekDates;
}
function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

export default function WeekOrgScreen({ navigation }) {
    const [recipes, setRecipes] = React.useState([]);
    const [currentWeek, setCurrentWeek] = React.useState([]);
    const [items, setItems] = React.useState({});
    const [selectedDay, setSelectedDay] = React.useState(getToday());
    const [visible, setVisible] = React.useState(false);
    const [card, setCard] = React.useState(false);
    const [selectedRecipe, setSelectedRecipe] = React.useState({});
    const [recipeChanged, setRecipeChanged] = React.useState(false);
    const weekArray = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']

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
            setCurrentWeek(getCurrentWeekDates());
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

    const transformDate = (date) => {
        const dateParts = date.split('-');
        const viewDate = `${dateParts[2]}.${dateParts[1]}.`;
        return viewDate
    }

    const goToRecipeScreen = (recipe) => {
        // Hier navigieren wir zur "Recipe" Seite
        navigation.navigate('Recipe', { title: recipe, category: recipe })
    };

    return (
        <View style={styles.viewContainer}>
            {currentWeek.map((day, index) => (
                <View key={index}>
                    <View style={styles.dayView}>
                        <View style={styles.dateView}>
                            <Text style={styles.fontSize}>{weekArray[index]}</Text>
                            <Text variant="titleMedium">{transformDate(day)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            {items[day] ?
                                <View style={styles.itemView}>
                                    <TouchableWithoutFeedback onPress={() => goToRecipeScreen(items[day]?.recipe.title)}>
                                        <View style={styles.item}>
                                            <Avatar.Image size={40} source={{ uri: items[day]?.recipe.description.imgUri }} />
                                            <Text numberOfLines={1} style={[styles.recipeText, styles.fontSize]}>{items[day]?.recipe.title}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <Button labelStyle={styles.buttonIcon} onPress={() => deleteRecipe(day)} icon={'trash-can-outline'}></Button>
                                </View>
                                :
                                <View style={styles.emptyItem}>
                                    <Button labelStyle={styles.buttonIcon} onPress={() => { setSelectedDay(day); openModal() }} icon={'plus-circle-outline'}></Button>
                                </View>
                            }
                        </View>
                    </View>
                    <Divider bold />
                </View>
            ))}
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
    viewContainer: {
        padding: 16,
        height: '90%',
        justifyContent: 'space-between'
    },
    dayView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 12,
    },
    itemView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 8,
    },
    dateView: {
        width: '34%',
    },
    recipeText: {
        marginLeft: 16,
        marginRight: 16
    },
    emptyItem: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    buttonIcon: {
        fontSize: 26,
        color: 'rgba(0,0,0,0.5)'
    },
    fontSize: {
        fontSize: 18
    }
})