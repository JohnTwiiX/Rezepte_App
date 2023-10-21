import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { Dialog, Button } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultCollection, defaultTypes } from './ReceptChips';
// import { getStorage } from './Overview';

// const receptTypes = ["Fisch", "Fleisch", "Kuchen", "Dessert", "Festtage", "", ""]
const sizes = [130, 160, 200];

function CircleButton({ descr, size, onPress, setSelectedItem, setVisible }) {
    return (
        <TouchableOpacity onLongPress={() => { setSelectedItem(descr), setVisible(true) }} onPress={onPress} style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}>
            <View style={styles.innerView}>
                <Text style={styles.text}>{descr}</Text>
            </View>
        </TouchableOpacity>
    );
}

async function deleteBubble(descr, setUpdate) {
    let values = await fetchBubbles();
    values.forEach(async ([key, value]) => {
        const parsedValue = JSON.parse(value);
        if (parsedValue.includes(descr)) {
            const updatedArray = parsedValue.filter(item => item !== descr);
            await updateAfterDelete(key, JSON.stringify(updatedArray));
            setUpdate(true);
        }
    })
}

async function updateAfterDelete(key, updatedArray) {
    try {
        await AsyncStorage.setItem(key, updatedArray);
    } catch (error) {
        console.error(`Deleting Error, ${error}`)
    }
}

async function fetchBubbles() {
    let values = await AsyncStorage.multiGet(['types', 'collection']);
    return values
}

async function fetchData(setReceptTypes) {
    try {
        fetchBubbles().then((data) => {
            let bubbles = [];
            if (data[0][1] === null && data[1][1] === null) {
                defaultTypes.forEach((value) => {
                    bubbles.push(value)
                });
                defaultCollection.forEach((value) => {
                    bubbles.push(value)
                });
            } else {
                data.forEach(([key, value]) => {
                    bubbles.push(...JSON.parse(value))
                });
            }
            setReceptTypes(bubbles);
        })
    } catch (e) {
        // read error
    }
}

export default function CircleButtons({ update, setUpdate }) {
    const [receptTypes, setReceptTypes] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    useFocusEffect(
        React.useCallback(() => {
            fetchData(setReceptTypes);
        }, []),
    );

    React.useEffect(() => {
        if (update === true) {
            fetchData(setReceptTypes);
            setUpdate(false);
        }
    }, [update])
    const navigation = useNavigation();
    return (
        <View>
            <ScrollView >
                <View style={styles.container}>
                    {receptTypes.map((bubble, index) =>
                        <CircleButton
                            key={index}
                            descr={bubble}
                            size={sizes[index % sizes.length]}
                            onPress={() => navigation.navigate('Category', { title: bubble })}
                            setSelectedItem={setSelectedItem}
                            setVisible={setVisible}
                        />)}
                </View>
            </ScrollView>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Content>
                    <Text style={{ fontSize: 22 }}>Bist du sicher, dass "{selectedItem}" gelöscht werden soll?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => { deleteBubble(selectedItem, setUpdate); setVisible(false) }}>Löschen</Button>
                    <Button onPress={() => { setVisible(false) }}>Abbrechen</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        fontFamily: 'Playfair_9pt_SemiCondensed-BlackItalic'
    },
    button: {
        backgroundColor: '#c2cac2',
        margin: 8
    },
    innerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: 21,
        fontFamily: 'spinwerad'
    }
});

