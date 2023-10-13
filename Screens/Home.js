import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

export default function HomeScreen({ navigation }) {
    useFocusEffect(
        React.useCallback(() => {
            setFetchedReceptCompleted();
            saveAll();
        }, []),);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AddRecept', { title: 'Rezept erstellen' })}
                onLongPress={() => getrecepts()}>
                <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
            <View>
                <CircleButtons />
            </View>
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
        top: 16,
        right: 16,
        alignItems: 'center',
        backgroundColor: '#9a998c',
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
