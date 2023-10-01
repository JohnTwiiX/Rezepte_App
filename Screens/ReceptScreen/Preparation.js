import * as React from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { List, Dialog, Paragraph, Button } from 'react-native-paper';
import { getRecept, getStorage, isFetchedRecept, setFetchedReceptCompleted } from './Overview';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sectionArray } from './Ingredients';

// async function saveRecept(recept) {
//     try {
//         let recepts = await AsyncStorage.getItem('recepts');
//         if (recepts) {
//             recepts = JSON.parse(recepts);
//         } else {
//             recepts = [];
//         }
//         let existingRecept = recepts.find(r => r.title === recept.title);
//         if (existingRecept) {
//             alert("Rezept with this title already exists");
//             return;
//         }
//         recepts.push(recept);
//         await AsyncStorage.setItem('recepts', JSON.stringify(recepts));
//     } catch (error) {
//         console.log(`Error saving recept: ${error}`);
//     }

// }
async function saveRecept(recept) {
    try {
        let recepts = await AsyncStorage.getItem('recepts');
        if (recepts) {
            recepts = JSON.parse(recepts);
            for (let i = 0; i < recepts.length; i++) {
                if (recepts[i].title === recept.title) {
                    recepts[i] = recept;
                    await AsyncStorage.setItem('recepts', JSON.stringify(recepts));
                    return;
                }
            }
        } else {
            recepts = [];
        }
        recepts.push(recept);
        await AsyncStorage.setItem('recepts', JSON.stringify(recepts));
    } catch (error) {
        console.log(`Error saving recept: ${error}`);
    }
}

async function saveMultiple(inputValues) {
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
            preparation: inputValues,
        },
    }
    saveRecept(recept);
}

async function removeAllExcept(keysToKeep) {
    try {
        const allKeys = await AsyncStorage.getAllKeys();
        const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key));
        await AsyncStorage.multiRemove(keysToRemove);
        // console.log('Removed keys:', keysToRemove);
    } catch (error) {
        console.error(`Error removing keys: ${error}`);
    }
}

// deleteAllStates = async () => {
//     const keysToKeep = ['Kategorie', 'Rezeptart', 'Sammlung', 'sections', 'recepts'];
//     removeAllExcept(keysToKeep);
// }

export async function saveAll(inputValues) {
    if (inputValues) {
        await saveMultiple(inputValues);
    }
    const keysToKeep = ['Kategorie', 'Rezeptart', 'Sammlung', 'sections', 'recepts'];
    await removeAllExcept(keysToKeep);
}



export default function PreparationsScreen({ navigation }) {
    const [sections, setSections] = React.useState([]);
    const [inputValues, setInputValues] = React.useState({});
    const [missingValues, setMissingValues] = React.useState([]);
    const [visibleDialog, setVisibleDialog] = React.useState(false);
    const [dialogSave, setDialogSave] = React.useState(false);
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const data = await getStorage('receptArray');
                if (data) {
                    setSections(data);
                    if (isFetchedRecept() === true) {
                        const recept = getRecept();
                        setInputValues(recept.description.preparation);
                    }
                }
            }
            fetchData();
        }, []),
    );

    return (
        <View style={{ flex: 1, margin: 8 }}>
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
                            style={{ borderColor: 'gray', backgroundColor: 'white', height: 200, overflow: 'hidden', padding: 8 }}
                            placeholder="Type something here!"
                            value={inputValues[item.title] || ""}
                            onChangeText={text => setInputValues(prevValues => ({ ...prevValues, [item.title]: text }))}
                        />
                    </List.Accordion>

                )}
            </List.Section>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{ backgroundColor: 'blue' }}
                    onPress={async () => {
                        const values = await AsyncStorage.multiGet(['title', 'selectedRezeptart', 'selectedKategorie', 'potionSize', 'workTime', 'receptArray']);
                        const valueObject = {};
                        values.forEach(([key, value]) => {
                            valueObject[key] = value;
                        });

                        if (!valueObject.title || !valueObject.selectedRezeptart || !valueObject.selectedKategorie || !valueObject.potionSize || !valueObject.workTime || !valueObject.receptArray) {
                            const missing = [];
                            if (!valueObject.title) missing.push('Titel');
                            if (!valueObject.selectedRezeptart) missing.push('Rezeptart');
                            if (!valueObject.selectedKategorie) missing.push('Kategorie');
                            if (!valueObject.potionSize) missing.push('Portionsgröße');
                            if (!valueObject.workTime) missing.push('Vorbereitunszeit');
                            if (!valueObject.receptArray || JSON.parse(valueObject.receptArray).length == 0) missing.push('Zutaten');
                            // console.log(missing)
                            setMissingValues(missing);
                            setVisibleDialog(true);
                            return;
                        } else {
                            setDialogSave(true);
                        }
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Rezept abspeichern</Text>
                </TouchableOpacity>
            </View>
            <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
                <Dialog.Content>
                    <Text style={{}}>Es fehlen "{missingValues.join(', ')}" noch zum speichern des Rezeptes!</Text>
                    {missingValues.includes('Zutaten') && <Text>Du musst bei Zutaten auf den "speichern" - Button klicken.</Text>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => { setVisibleDialog(false) }}>Ok</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog visible={dialogSave} onDismiss={() => setDialogSave(false)}>
                <Dialog.Content>
                    {<Text style={{}}>Möchtest du dein Rezept abspeichern?</Text>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => {
                        // Hier kannst du den Navigation-Stack auf den HomeScreen zurücksetzen:
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                        // Hier könntest du die Werte in den useStates zurücksetzen:
                        setSections([]);
                        saveAll(inputValues);
                        setFetchedReceptCompleted();
                        setDialogSave(false)
                    }}>Ja</Button>
                    <Button onPress={() => { setDialogSave(false) }}>Nein</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
}