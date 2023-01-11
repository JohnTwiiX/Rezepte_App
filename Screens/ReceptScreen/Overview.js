import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Divider } from 'react-native-paper';
import ReceptTypeChips from '../modals/OverviewChips';
import CategoryChips from '../modals/OverviewCategory';
import CollectionChips from '../modals/OverviewCollection';
import AsyncStorage from '@react-native-async-storage/async-storage';

// getAllKeys = async () => {
//     let keys = []
//     try {
//         keys = await AsyncStorage.getAllKeys()
//     } catch (e) {
//         // read key error
//     }

//     console.log(keys)
//     // example console.log result:
//     // ['@MyApp_user', '@MyApp_key']
// }

// removeFew = async () => {
//     const keys = ['Eissorten', 'sgfg', 'sh']
//     try {
//         await AsyncStorage.multiRemove(keys)
//     } catch (e) {
//         // remove error
//     }

//     console.log('Done')
// }

// getMultiple = async () => {

//     let values
//     try {
//         values = await AsyncStorage.multiGet(['Kategorie', 'Sammlung', 'Rezeptart'])
//     } catch (e) {
//         // read error
//     }
//     console.log(values)

//     // example console.log output:
//     // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
// }

export const saveInStorage = async (title, value) => {
    try {
        await AsyncStorage.setItem(title, value);
    } catch (error) {
        console.log(`Error saving ${title}: ${error}`);
    }
}

// export const getStorage = async (title) => {
//     try {
//         const arrayInString = await AsyncStorage.getItem(title);
//         if (arrayInString != null) {
//             return JSON.parse(arrayInString);
//         }
//         return null;
//     } catch (error) {
//         console.log(`Error retrieving ${title}: ${error}`);
//     }
// }

export default function Overview({ navigation }) {
    const [title, setTitle] = React.useState("");
    const [potionSize, setPotionSize] = React.useState("");
    const [workTime, setWorkTime] = React.useState("");
    const [cookingTime, setCookingTime] = React.useState("");


    return (
        <ScrollView>
            <View style={styles.container}>
                {/* <Button title='Klick mich' onPress={() => getMultiple()} /> */}
                <TextInput
                    style={styles.input}
                    label="Titel"
                    value={title}
                    onChangeText={title => { setTitle(title), saveInStorage('Titel', title) }}
                />
                <View style={styles.chipContainer} >
                    <Text>Rezeptart:</Text>
                    <ReceptTypeChips />
                    <Divider />
                </View>
                <View style={styles.chipContainer}>
                    <Text>Kategorie:</Text>
                    <CategoryChips />
                </View>
                <View style={styles.chipContainer}>
                    <Text>Sammlungen:</Text>
                    <CollectionChips />
                </View>
                <TextInput
                    style={styles.input}
                    label="Portionsgröße"
                    value={potionSize}
                    onChangeText={potionSize => setPotionSize(potionSize)}
                />
                <TextInput
                    style={styles.input}
                    label="Vorbereitungszeit"
                    value={workTime}
                    onChangeText={workTime => setWorkTime(workTime)}
                />
                <TextInput
                    style={styles.input}
                    label="Kochzeit"
                    value={cookingTime}
                    onChangeText={cookingTime => setCookingTime(cookingTime)}
                />
                {/* <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Ingredients')}>
                    <Text>Weiter</Text>
                </TouchableOpacity> */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8
    },
    button: {
        // position: 'absolute',
        // top: 16,
        // left: 16,
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 100,

    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    chipContainer: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    input: {
        marginTop: 8,
        marginBottom: 8
    }
});