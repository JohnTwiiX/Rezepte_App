import * as React from 'react';
import { Button, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { List } from 'react-native-paper';
import { getStorage } from './Overview';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function saveRecept(recept) {
    try {
        let recepts = await AsyncStorage.getItem('recepts');
        if (recepts) {
            recepts = JSON.parse(recepts);
        } else {
            recepts = [];
        }
        recepts.push(recept);
        console.log(recepts)
        await AsyncStorage.setItem('recepts', JSON.stringify(recepts));
    } catch (error) {
        console.log(`Error saving recept: ${error}`);
    }

}

async function saveMultiple() {
    const values = await AsyncStorage.multiGet(['title', 'selectedRezeptart', 'selectedKategorie', 'selectedSammlung', 'potionSize', 'workTime', 'cookingTime', 'receptArray']);
    const valueObject = {};
    values.forEach(([key, value]) => {
        valueObject[key] = value;
    });
    const recept = {
        title: valueObject.title,
        description: {
            receptType: JSON.parse(valueObject.selectedRezeptart),
            category: JSON.parse(valueObject.selectedKategorie),
            collection: JSON.parse(valueObject.selectedSammlung),
            potionSize: valueObject.potionSize,
            workTime: valueObject.workTime,
            cookingTime: valueObject.cookingTime,
            receptArray: JSON.parse(valueObject.receptArray),
        },
    }
    saveRecept(recept);

}

async function removeAllExcept(keysToKeep) {
    try {
        const allKeys = await AsyncStorage.getAllKeys();
        const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key));
        await AsyncStorage.multiRemove(keysToRemove);
        console.log('Removed keys:', keysToRemove);
    } catch (error) {
        console.error(`Error removing keys: ${error}`);
    }
}

// deleteAllStates = async () => {
//     const keysToKeep = ['Kategorie', 'Rezeptart', 'Sammlung', 'sections', 'recepts'];
//     removeAllExcept(keysToKeep);
// }

async function saveAll() {
    await saveMultiple()
    const keysToKeep = ['Kategorie', 'Rezeptart', 'Sammlung', 'sections', 'recepts'];
    await removeAllExcept(keysToKeep);

}



export default function PreparationsScreen({ navigation }) {
    const [sections, setSections] = React.useState([]);
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const data = await getStorage('receptArray');
                if (data) {
                    setSections(data);
                }
            }
            fetchData();
        }, []),
    );
    return (
        <View style={{ flex: 1, margin: 8 }}>
            {/* <Button title='Aktualisieren' onPress={() => setActuel(true)} /> */}
            <List.Section style={{}}>
                {sections.map((item, index) =>
                    <List.Accordion
                        key={index}
                        title={item.title}
                        style={{ borderWidth: 1, }}
                    >
                        <TextInput
                            multiline={true}
                            returnKeyType="done"
                            textAlignVertical='top'
                            style={{ height: 40, borderColor: 'gray', backgroundColor: 'white', height: '100%', overflow: 'hidden', padding: 8 }}
                            placeholder="Type something here!"
                            onChangeText={text => console.log(text)}
                        />
                    </List.Accordion>
                )}
            </List.Section>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{ backgroundColor: 'blue' }}
                    onPress={() => {
                        // Hier kannst du den Navigation-Stack auf den HomeScreen zurücksetzen:
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                        // Hier könntest du die Werte in den useStates zurücksetzen:
                        setSections([]);
                        saveAll();
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Rezept abspeichern</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}