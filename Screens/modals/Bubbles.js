import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getStorage } from './Overview';

const receptTypes = ["Fisch", "Fleisch", "Kuchen", "Dessert", "Festtage", "", ""];
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


export default function CircleButtons() {
    const [receptTypes, setReceptTypes] = React.useState([]);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                let values
                try {
                    values = await AsyncStorage.multiGet(['Kategorie', 'Sammlung', 'Rezeptart'])
                } catch (e) {
                    // read error
                }
                let data = [];
                values.forEach(([key, value]) => {
                    data.push(...JSON.parse(value))
                });
                setReceptTypes(data);
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
    },
    button: {
        backgroundColor: '#0066cc',
        margin: 8
    },
    innerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: 20
    }
});

