import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { Dialog, Button, RadioButton, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import CircleButtons from './modals/Bubbles';
import { setFetchedReceptCompleted } from './ReceptScreen/Overview';
import { saveAll } from './ReceptScreen/Preparation';
import { setSectionArrayEmpty } from './ReceptScreen/Ingredients';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

getAllKeys = async () => {
    let keys = []
    try {
        keys = await AsyncStorage.getAllKeys()
        console.log(keys)
    } catch (e) {
        // read key error
        console.error(e)
    }

    console.log(keys)
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
}

deleteKey = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e) {
        console.log(e)
        // remove error
    }

    console.log('Done.')
}

getrecepts = async () => {
    try {
        let recepts = await AsyncStorage.getItem('recepts');
        if (recepts) {
            // Überprüfe, ob das Ergebnis von AsyncStorage nicht null ist
            recepts = JSON.parse(recepts); // Parsen des JSON-Strings zu einem Array oder Objekt
            recepts.forEach((item) => {
                console.log(item);
            });
        }
    } catch (e) {
        console.error(e)
    }
}
// export async function saveInStorage(title, array) {
//     try {
//         const arrayInString = JSON.stringify(array);
//         await AsyncStorage.setItem(title, arrayInString);
//     } catch (error) {
//         console.log(`Error saving ${title}: ${error}`);
//     }
// }

const getStorage = async () => {
    try {
        const arrayInString = await AsyncStorage.getItem('recepts');
        console.log(arrayInString)
    } catch (error) {
        console.log(`Error retrieving ${title}: ${error}`);
    }
}

saveInStorage = async (type, text) => {
    try {
        const alteWerte = await AsyncStorage.getItem(type);
        if (alteWerte != null) {
            const alteListe = alteWerte ? JSON.parse(alteWerte) : [];
            if (alteListe.includes(text)) {
                return true;
            }
            alteListe.push(text);
            try {
                const alteListeString = JSON.stringify(alteListe);
                await AsyncStorage.setItem(type, alteListeString);
            } catch (error) {
                console.error(`Error saving ${text} in ${type}: ${error}`)
            }
        }
    } catch (error) {
        console.error(`Error retrieving ${type}: ${error}`)
    }
}

export default function HomeScreen({ navigation }) {
    const [visible, setVisible] = React.useState(false);
    const [type, setType] = React.useState('');
    const [text, setText] = React.useState('');
    const [alert, setAlert] = React.useState(false);
    const [exist, setExist] = React.useState(false);
    const [update, setUpdate] = React.useState(false);


    const theme = useTheme();

    const handleSaveBubble = async () => {
        if (type.length === 0 || text.length === 0) {
            setAlert(true);
            return;
        };
        const exists = await saveInStorage(type, text);
        if (exists) {
            setAlert(true);
            setExist(true);
            return;
        }
        setUpdate(true);
        setVisible(false);
    };
    const handleBackgroundPress = () => {
        // Minimiere das Keyboard, wenn irgendwo anders auf dem Bildschirm geklickt wird
        Keyboard.dismiss();
    };

    React.useEffect(() => {
        setAlert(false);
        setText('');
        setType('');
    }, [visible === false]);

    useFocusEffect(
        React.useCallback(() => {
            saveAll();
        }, []),);

    return (


        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.button }]}
                // onPress={() => { setVisible(true) }}
                onPress={() => { deleteKey('@basket') }}
                // onPress={() => { getAllKeys() }}
                onLongPress={() => getStorage('@basket')}>
                <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
            <View>
                <CircleButtons update={update} setUpdate={setUpdate} />
            </View>

            <Dialog visible={visible} onDismiss={() => setVisible(false)} style={{ paddingBottom: 50 }}>
                <Dialog.Content>
                    <Text style={{ fontSize: 22 }}>Was für eine Bubble möchtest du erstellen?</Text>
                    <View style={{ margin: 16 }}>
                        <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <RadioButton value="types" />
                                    <Text>Rezeptart</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <RadioButton value="collection" />
                                    <Text>Sammlung</Text>
                                </View>
                            </View>
                        </RadioButton.Group>
                        {alert && (type.length === 0) && <Text style={{ color: 'red', textAlign: 'center' }}>Du must eines der beiden klicken!</Text>}
                    </View>
                    <TextInput
                        style={{ backgroundColor: theme.colors.color }}
                        label="Bubble"
                        value={text}
                        onChangeText={text => setText(text)}
                        error={alert && text.length === 0}
                    />
                    {alert && (text.length === 0) && <Text style={{ color: 'red', textAlign: 'center' }}>Dein Text hierein schreiben!</Text>}
                    {alert && exist && <Text style={{ color: 'red', textAlign: 'center' }}>Der eingetragene Wert existiert bereits!</Text>}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => { handleSaveBubble() }}>Speichern</Button>
                    <Button onPress={() => { setVisible(false) }}>Abbrechen</Button>
                </Dialog.Actions>
            </Dialog>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        position: 'absolute',
        top: 24,
        right: 16,
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        zIndex: 2
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
});
