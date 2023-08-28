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
    } catch (e) {
        // read key error
        console.error(e)
    }

    console.log(keys)
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
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
                onPress={() => navigation.navigate('AddRecept')}
                onLongPress={() => getAllKeys()}>
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
