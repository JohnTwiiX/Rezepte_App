import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Dialog, Button, RadioButton, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import CircleButtons from './Bubbles/Bubbles';
import { saveAll } from './Recept/ReceptScreen/Preparation';
import { useFocusEffect } from '@react-navigation/native';
import { deleteKey, getAllKeys, getArrayFromStorage, saveArrayStorage } from '../modals/StorageService';

saveInStorage = async (type, text) => {
    try {
        const alteWerte = await getArrayFromStorage(type)
        if (alteWerte != null) {
            const alteListe = alteWerte ? alteWerte : [];
            if (alteListe.includes(text)) {
                return true;
            }
            alteListe.push(text);
            try {
                await saveArrayStorage(type, alteListe);
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

        <ImageBackground source={require('../../assets/images/bg.jpg')} >
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.button }]}
                    // onPress={() => { setVisible(true) }}
                    onPress={() => { deleteKey('@name') }}
                    // onPress={() => { getAllKeys() }}
                    onLongPress={() => console.log(getArrayFromStorage('receptTypes'))}>
                    <Icon name="plus" size={26} color="black" />
                </TouchableOpacity>
                <View style={{ backgroundColor: 'transparent' }}>
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
                            style={{ backgroundColor: theme.color }}
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
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 56,
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
