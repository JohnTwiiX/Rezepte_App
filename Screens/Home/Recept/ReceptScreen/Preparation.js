import * as React from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { List, Dialog, Button, useTheme } from 'react-native-paper';
import { useData } from '../../../modals/DataProvider';
import { getAllKeys, getArrayFromStorage, multiRemoveKeys, saveArrayStorage } from '../../../modals/StorageService';

async function saveRecept(recept) {
    try {
        let recepts = await getArrayFromStorage('recepts');
        if (recepts) {
            recepts = JSON.parse(recepts);
            for (let i = 0; i < recepts.length; i++) {
                if (recepts[i].title === recept.title) {
                    recepts[i] = recept;
                    await saveArrayStorage('recepts', recepts);
                    return;
                }
            }
        } else {
            recepts = [];
        }
        recepts.push(recept);
        await saveArrayStorage('recepts', recepts);
    } catch (error) {
        console.log(`Error saving recept: ${error}`);
    }
}

async function saveMultiple(data, inputValues) {
    const recept = {
        title: data.title,
        description: {
            receptType: data.types,
            category: data.category,
            collection: data.collection,
            potionSize: data.potionSize,
            workTime: data.workTime,
            cookingTime: data.cookingTime,
            receptArray: data.receptArray,
            preparation: inputValues,
            imgUri: data.imgUri.length === 0 ?
                'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg'
                : data.imgUri,
        },
    }
    saveRecept(recept);
}

async function removeAllExcept(keysToKeep) {
    try {
        const allKeys = await getAllKeys();
        const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key));
        await multiRemoveKeys(keysToRemove);
    } catch (error) {
        console.error(`Error removing keys: ${error}`);
    }
}

export async function saveAll(data, inputValues) {
    if (inputValues) {
        await saveMultiple(data, inputValues);
    }
    const keysToKeep = ['types', 'category', 'collection', 'sections', 'recepts', 'receptTypes', '@name', '@basket'];
    await removeAllExcept(keysToKeep);
}



export default function PreparationsScreen({ navigation }) {
    const [inputValues, setInputValues] = React.useState([]);
    const [missingValues, setMissingValues] = React.useState([]);
    const [visibleDialog, setVisibleDialog] = React.useState(false);
    const [dialogSave, setDialogSave] = React.useState(false);
    const theme = useTheme();
    const { data } = useData();

    React.useEffect(() => {
        if (data.isFetched) {
            setInputValues(data.preparation)
        }
    }, [data.isFetched])

    return (
        <View style={{ flex: 1, margin: 8 }}>
            <List.Section style={{}}>
                {data.receptArray.map((item, index) =>
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
                    style={[styles.button, { backgroundColor: theme.button }]}
                    onPress={async () => {
                        const values = data;
                        const missings = [];
                        if (values.title.length === 0) missings.push('Titel');
                        if (values.types.length === 0) missings.push('Rezeptart');
                        if (values.category.length === 0) missings.push('Kategorie');
                        if (values.potionSize.length === 0) missings.push('Portionsgröße');
                        if (values.workTime.length === 0) missings.push('Vorbereitunszeit');
                        if (values.receptArray.length == 0) missings.push('Zutaten');
                        if (missings.length >= 1) {
                            setMissingValues(missings);
                            setVisibleDialog(true);
                            return;
                        } else {
                            setDialogSave(true);
                        }
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Rezept abspeichern</Text>
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
                        saveAll(data, inputValues);
                        setDialogSave(false)
                    }}>Ja</Button>
                    <Button onPress={() => { setDialogSave(false) }}>Nein</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
    }
})