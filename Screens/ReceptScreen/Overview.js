import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput, Divider, List, useTheme } from 'react-native-paper';
import ReceptTypeChips from '../modals/OverviewChips';
import CategoryChips from '../modals/OverviewCategory';
import CollectionChips from '../modals/OverviewCollection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Switcher from '../modals/Switcher';
import { useData } from '../modals/DataProvider';

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

// const saveInStorageInput = async (title, value) => {
//     try {
//         await AsyncStorage.setItem(title, value);
//     } catch (error) {
//         console.log(`Error saving ${title}: ${error}`);
//     }
// }
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

function jsonToString(crowd, unit) {
    if (crowd && unit) {
        const result = JSON.stringify({
            'crowd': crowd,
            'unit': unit
        });
        return result
    } else {
        return null;
    }

}

function stringToJson(prop) {
    if (prop) {
        const result = JSON.parse(prop);
        return result
    }


}

let receptForAll
let fetchedReceptCompleted = false;

export default function Overview({ route }) {
    const [title, setTitle] = React.useState("");
    const [potionSize, setPotionSize] = React.useState("");
    const [workTime, setWorkTime] = React.useState("");
    const [cookingTime, setCookingTime] = React.useState("");
    const [fetchedRecept, setFetchedRecept] = React.useState({});
    const [workSwitch, setWorkSwitch] = React.useState("min");
    const [cookSwitch, setCookSwitch] = React.useState("min");
    const [potionSwitch, setPotionSwtich] = React.useState("Person");
    const { recept } = route.params;
    const theme = useTheme();
    const inputRef = React.useRef(null);
    const { data, updateData } = useData();

    const handleBackgroundPress = () => {
        // Minimiere das Keyboard, wenn irgendwo anders auf dem Bildschirm geklickt wird
        Keyboard.dismiss();
    };

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
        if (fetchedRecept.length < 0) {
            const potion = stringToJson(fetchedRecept?.description?.potionSize);
            const work = stringToJson(fetchedRecept?.description?.workTime);
            const cook = stringToJson(fetchedRecept?.description?.cookingTime);

            setTitle(fetchedRecept.title);

            setPotionSize(potion.crowd);
            setPotionSwtich(potion.unit);

            setWorkTime(work.crowd);
            setWorkSwitch(work.unit);

            setCookingTime(cook.crowd);
            setCookSwitch(cook.unit);
        }

    }, [fetchedRecept]);

    React.useEffect(() => {
        if (title !== undefined) {
            handleDataChange('title', title);
        }
    }, [title]);

    React.useEffect(() => {
        if (potionSize !== undefined) {
            handleDataChange('potionSize', jsonToString(potionSize, potionSwitch));
        }
    }, [potionSize]);

    React.useEffect(() => {
        if (workTime !== undefined) {
            handleDataChange('workTime', jsonToString(workTime, workSwitch));
        }
    }, [workTime]);

    React.useEffect(() => {
        if (cookingTime !== undefined) {
            handleDataChange('cookingTime', jsonToString(cookingTime, cookSwitch));
        }
    }, [cookingTime]);

    React.useEffect(() => {
        if (cookingTime) {
            const result = jsonToString(cookingTime, cookSwitch)
            console.log(result)
            if (result !== null) {
                console.log(result)
                handleDataChange('cookingTime', result);
            }
        }
    }, [cookSwitch]);

    React.useEffect(() => {
        if (workTime) {
            const result = jsonToString(workTime, workSwitch)
            if (result !== null) {
                handleDataChange('workTime', result);
            }
        }
    }, [workSwitch]);

    React.useEffect(() => {
        if (potionSize) {
            const result = jsonToString(potionSize, potionSwitch)
            if (result !== null) {
                handleDataChange('potionTime', result);
            }
        }
    }, [potionSwitch]);



    const handleDataChange = (dataValue, newValue) => {

        if (newValue) {
            console.log(dataValue)
            console.log(newValue)
            // Erstelle ein neues Objekt, das eine Kopie der aktuellen Daten enthält
            const updatedData = { ...data };
            // Aktualisiere das Objekt mit dem neuen Wert für den angegebenen Schlüssel (dataValue)
            updatedData[dataValue] = newValue;
            // Aktualisiere die Daten im Kontext mit dem aktualisierten Objekt
            updateData(updatedData);
        }
    };


    return (
        <TouchableWithoutFeedback onPress={handleBackgroundPress}>
            <View style={styles.container}>
                {/* <Button title='Klick mich' onPress={() => { getAllKeys().then((data) => { console.log(data) }); }} /> */}
                <TextInput
                    style={[styles.input, { backgroundColor: theme.colors.color }]}
                    label="Titel"
                    ref={inputRef}
                    value={title ? title : fetchedRecept.title}
                    onChangeText={title => { setTitle(title) }}
                />
                <View style={styles.chipContainer} >
                    <Text>Rezeptart:</Text>
                    <ReceptTypeChips handleDataChange={handleDataChange} selectedChipType={fetchedRecept?.description?.receptType} />
                </View>
                <View style={styles.chipContainer}>
                    <Text>Kategorie:</Text>
                    <CategoryChips handleDataChange={handleDataChange} selectedChipCat={fetchedRecept?.description?.category} />
                </View>
                <View style={styles.chipContainer}>
                    <Text>Sammlungen:</Text>
                    <CollectionChips handleDataChange={handleDataChange} selectedChipCol={fetchedRecept?.description?.collection} />
                </View>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginTop: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.colors.color }]}
                            label={
                                potionSize ? null : (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <Icon name='account-outline' size={20} color='rgba(0, 0, 0, 0.3)' />
                                    </View>
                                )
                            }
                            ref={inputRef}
                            keyboardType='phone-pad'
                            value={potionSize ? potionSize : stringToJson(fetchedRecept?.description?.potionSize)?.crowd}
                            onChangeText={potionSize => { setPotionSize(potionSize) }}
                        />
                        <Switcher title={potionSwitch} setSwitch={setPotionSwtich} prop={'potion'} />

                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.colors.color }]}
                            label={
                                workTime ? null : (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <Icon name='clock-time-two-outline' size={20} color='rgba(0, 0, 0, 0.3)' />
                                    </View>
                                )
                            }
                            ref={inputRef}
                            keyboardType='phone-pad'
                            value={workTime ? workTime : stringToJson(fetchedRecept?.description?.workTime)?.crowd}
                            onChangeText={workTime => { setWorkTime(workTime) }}
                        />
                        <Switcher title={workSwitch} setSwitch={setWorkSwitch} prop={'work'} />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.colors.color }]}
                            label={
                                cookingTime ? null : (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <Icon name='pot-mix-outline' size={20} color='rgba(0, 0, 0, 0.3)' />
                                    </View>
                                )
                            }
                            ref={inputRef}
                            keyboardType='phone-pad'
                            value={cookingTime ? cookingTime : stringToJson(fetchedRecept?.description?.cookingTime)?.crowd}
                            onChangeText={cookingTime => { setCookingTime(cookingTime) }}
                        />
                        <Switcher title={cookSwitch} setSwitch={setCookSwitch} prop={'cook'} />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create(
    {
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
            textAlign: 'center',
            borderTopRightRadius: 0,
        }
    });