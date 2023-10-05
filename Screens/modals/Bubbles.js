import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultCollection, defaultTypes } from './ReceptChips';
// import { getStorage } from './Overview';

// const receptTypes = ["Fisch", "Fleisch", "Kuchen", "Dessert", "Festtage", "", ""]
const sizes = [130, 160, 200];

function CircleButton({ descr, size, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}>
            <View style={styles.innerView}>
                <Text style={styles.text}>{descr}</Text>
            </View>
        </TouchableOpacity>
    );
}

async function fetchBubbles() {
    let values = await AsyncStorage.multiGet(['types', 'collection']);
    return values
}


export default function CircleButtons() {
    const [receptTypes, setReceptTypes] = React.useState([]);
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
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
            fetchData();
        }, []),
    );
    const navigation = useNavigation();
    return (
        <ScrollView >
            <View style={styles.container}>
                {receptTypes.map((bubble, index) =>
                    <CircleButton
                        key={index}
                        descr={bubble}
                        size={sizes[index % sizes.length]}
                        onPress={() => navigation.navigate('Category', { title: bubble })} />)}
            </View>
        </ScrollView>
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

