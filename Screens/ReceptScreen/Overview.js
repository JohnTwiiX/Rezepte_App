import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Divider } from 'react-native-paper';
import ReceptTypeChips from '../modals/OverviewChips';
import CategoryChips from '../modals/OverviewCategory';
import CollectionChips from '../modals/OverviewCollection';
import AsyncStorage from '@react-native-async-storage/async-storage';

const removeValue = async () => {
    try {
        await AsyncStorage.removeItem('recepts')
    } catch (e) {
        // remove error
    }

    console.log('Done.')
}

const getMyObject = async () => {
    let value
    try {
        const jsonValue = await AsyncStorage.getItem('receptArray')
        value = JSON.parse(jsonValue)
    } catch (e) {
        // read error
    }

    console.log('Klick mich button', value)
}

getAllKeys = async () => {
    let keys = []
    try {
        return keys = await AsyncStorage.getAllKeys()
    } catch (e) {
        // read key error
    }

    console.log(keys)
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
}

removeFew = async () => {
    const keys = ['Kategorie', 'Sammlung', 'Rezeptart', 'Titel']
    try {
        await AsyncStorage.multiRemove(keys)
    } catch (e) {
        // remove error
    }

    console.log('Done')
}

getMultiple = async () => {

    let values
    try {
        values = await AsyncStorage.multiGet(['recepts'])
    } catch (e) {
        // read error
    }
    console.log(values)

    // example console.log output:
    // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
}

export async function saveInStorage(title, array) {
    try {
        const arrayInString = JSON.stringify(array);
        await AsyncStorage.setItem(title, arrayInString);
    } catch (error) {
        console.log(`Error saving ${title}: ${error}`);
    }
}

export const getStorage = async (title) => {
    try {
        const arrayInString = await AsyncStorage.getItem(title);
        if (arrayInString != null) {
            return JSON.parse(arrayInString);
        }
        return null;
    } catch (error) {
        console.log(`Error retrieving ${title}: ${error}`);
    }
}

const saveInStorageInput = async (title, value) => {
    try {
        await AsyncStorage.setItem(title, value);
    } catch (error) {
        console.log(`Error saving ${title}: ${error}`);
    }
}
export async function fetchData(recept) {
    const data = await getStorage('recepts');

    if (data) {
        const result = data.find(r => r.title === recept);
        return result;
    }
    return null;
}

export function getRecept() {
    return receptForAll;
}

export function isFetchedRecept() {
    return fetchedReceptCompleted
}

export function setFetchedReceptCompleted() {
    fetchedReceptCompleted = false;
}

let receptForAll
let fetchedReceptCompleted = false;

export default function Overview({ route }) {
    const [title, setTitle] = React.useState("");
    const [potionSize, setPotionSize] = React.useState("");
    const [workTime, setWorkTime] = React.useState("");
    const [cookingTime, setCookingTime] = React.useState("");
    const [fetchedRecept, setFetchedRecept] = React.useState({})
    const { recept } = route.params;




    React.useEffect(() => {
        if (recept) {
            console.log(recept)
            fetchData(recept).then((data) => {
                setFetchedRecept(data);
                receptForAll = data;
                fetchedReceptCompleted = true;
            });
        };
    }, [])

    React.useEffect(() => {
        setTitle(fetchedRecept.title);
        setPotionSize(fetchedRecept?.description?.potionSize);
        setWorkTime(fetchedRecept?.description?.workTime);
        setCookingTime(fetchedRecept?.description?.cookingTime);
    }, [fetchedRecept]);

    React.useEffect(() => {
        if (title !== undefined) {
            saveInStorageInput('title', title);
        }
    }, [title]);

    React.useEffect(() => {
        if (potionSize !== undefined) {
            saveInStorageInput('potionSize', potionSize);
        }

    }, [potionSize]);

    React.useEffect(() => {
        if (workTime !== undefined) {
            saveInStorageInput('workTime', workTime);
        }
    }, [workTime]);

    React.useEffect(() => {
        if (cookingTime !== undefined) {
            saveInStorageInput('cookingTime', cookingTime);
        }
    }, [cookingTime]);


    return (
        <ScrollView>
            <View style={styles.container}>
                {/* <Button title='Klick mich' onPress={() => { getAllKeys().then((data) => { console.log(data) }); }} /> */}
                <TextInput
                    style={styles.input}
                    label="Titel"
                    value={fetchedRecept ? fetchedRecept.title : title}
                    onChangeText={title => { setTitle(title) }}
                />
                <View style={styles.chipContainer} >
                    <Text>Rezeptart:</Text>
                    <ReceptTypeChips selectedChipType={fetchedRecept?.description?.receptType} />
                </View>
                <View style={styles.chipContainer}>
                    <Text>Kategorie:</Text>
                    <CategoryChips selectedChipCat={fetchedRecept?.description?.category} />
                </View>
                <View style={styles.chipContainer}>
                    <Text>Sammlungen:</Text>
                    <CollectionChips selectedChipCol={fetchedRecept?.description?.collection} />
                </View>
                <TextInput
                    style={styles.input}
                    label="Portionsgröße"
                    value={fetchedRecept ? fetchedRecept?.description?.potionSize : potionSize}
                    onChangeText={potionSize => { setPotionSize(potionSize) }}
                />
                <TextInput
                    style={styles.input}
                    label="Vorbereitungszeit"
                    value={fetchedRecept ? fetchedRecept?.description?.workTime : workTime}
                    onChangeText={workTime => { setWorkTime(workTime) }}
                />
                <TextInput
                    style={styles.input}
                    label="Kochzeit"
                    value={fetchedRecept ? fetchedRecept?.description?.cookingTime : cookingTime}
                    onChangeText={cookingTime => { setCookingTime(cookingTime) }}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    button: {
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
        marginBottom: 8,
        backgroundColor: '#e1e1e1'
    }
});