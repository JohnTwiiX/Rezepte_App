import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { getArrayFromStorage, saveArrayStorage } from '../modals/StorageService';
import { Modal, Text } from 'react-native-paper';
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
    let date = `${year}-${month}-${day}`;
    for (let key in recipeJson) {
        if (Date.parse(key) > Date.parse(date)) {
            result[key] = recipeJson[key]
        }
    }
    // let filteredData = recipeJson.filter(date => date > MonthAgo); // Nur die Daten filtern, die neuer als ein Monat sind
    return result;
};

export default function WeekOrgScreen({ navigation }) {
    const [recipes, setRecipes] = React.useState([])
    const [items, setItems] = React.useState({});
    const [selectedDay, setSelectedDay] = React.useState(getToday());
    const [visible, setVisible] = React.useState(false);
    const [card, setCard] = React.useState(false);
    const [selectedRecipe, setSelectedRecipe] = React.useState({});

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const fetchedRecipes = await getArrayFromStorage('recipes');
                if (fetchedRecipes) {
                    setRecipes(fetchedRecipes)
                }
            }
            setSelectedDay(getToday());
            fetchData();
        }, []),);
    const fetchData = async () => {
        let result = await getArrayFromStorage('@checkedRecipes');
        if (result === null) {
            setItems({});
        } else {
            setItems(result);
        };
    }

    React.useEffect(() => {
        saveCheckedRecipes()
    }, [items.length])

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
    };

    // Funktion zum Löschen eines Rezepts
    const deleteRecipe = (date) => {
        if (items[date]) {
            // Die Rezepte für den gegebenen Tag werden gelöscht
            delete items[date];

            // Die neuen Rezepte werden in den Zustand gespeichert
            setItems({ ...items });
        }
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

    return (
        <View style={{ flex: 1 }}>
            <Text variant="displaySmall" style={styles.title}>Wochen Planer</Text>
            <Agenda
                firstDay={1}
                selected={getToday()}
                // Die zu zeigenden Elemente
                items={items}

                // Callback, wenn ein Tag geändert wird
                onDayPress={onDayPress}

                // Callback zur Darstellung eines Elements
                renderItem={(item) => {
                    return (<View><Text>{item.recipe.title}</Text></View>);
                }}
                showOnlySelectedDayItems
                // Callback zur Darstellung eines leeren Datums
                renderEmptyData={() => {
                    return (
                        <View>
                            <Text>Kein Rezept ausgewählt </Text>
                            <Button title="Rezept hinzufügen" onPress={() => openModal()} />
                        </View>
                    );
                }}
                renderDay={(day) => {
                    const recipe = items[selectedDay];
                    return (
                        <View style={{ width: '100%', backgroundColor: 'red' }}>
                            <Text>{selectedDay}</Text>
                            <Text>{recipe.recipe.title}</Text>
                            <Button title="Rezept löschen" onPress={() => deleteRecipe(selectedDay)} />
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
            <Text>Ende</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        textDecorationLine: 'underline',
        textDecorationStyle: 'double',
        marginBottom: 24
    }
})