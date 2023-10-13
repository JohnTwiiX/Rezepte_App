import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Switcher from '../modals/Switcher';
import { useData } from '../modals/DataProvider';
import OverviewInput from '../modals/OverviewInput';
import ReceptChips from '../modals/ReceptChips';

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
    const result = JSON.stringify({
        crowd: crowd,
        unit: unit
    });
    return result
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
    const [potionSwitch, setPotionSwitch] = React.useState("Person");
    // const { recept } = route.params;
    const inputRef = React.useRef(null);
    const { data, updateData } = useData();

    const handleBackgroundPress = () => {
        // Minimiere das Keyboard, wenn irgendwo anders auf dem Bildschirm geklickt wird
        Keyboard.dismiss();
    };

    const handleDataChange = (dataValue, newValue) => {
        if (newValue) {
            // console.log(dataValue, newValue)
            // Erstelle ein neues Objekt, das eine Kopie der aktuellen Daten enthält
            const updatedData = { ...data };
            // Aktualisiere das Objekt mit dem neuen Wert für den angegebenen Schlüssel (dataValue)
            updatedData[dataValue] = newValue;
            // Aktualisiere die Daten im Kontext mit dem aktualisierten Objekt
            updateData(updatedData);
        }
    };
    // React.useEffect(() => {
    //     if (recept) {
    //         console.log(recept)
    //         fetchData(recept).then((data) => {
    //             setFetchedRecept(data);
    //             receptForAll = data;
    //             fetchedReceptCompleted = true;
    //         });
    //     };
    // }, [])

    // React.useEffect(() => {
    //     if (fetchedRecept.length < 0) {
    //         const potion = stringToJson(fetchedRecept?.description?.potionSize);
    //         const work = stringToJson(fetchedRecept?.description?.workTime);
    //         const cook = stringToJson(fetchedRecept?.description?.cookingTime);

    //         setTitle(fetchedRecept.title);

    //         setPotionSize(potion.crowd);
    //         setPotionSwitch(potion.unit);

    //         setWorkTime(work.crowd);
    //         setWorkSwitch(work.unit);

    //         setCookingTime(cook.crowd);
    //         setCookSwitch(cook.unit);
    //     }

    // }, [fetchedRecept]);

    React.useEffect(() => {
        if (data.isFetched) {
            setTitle(data.title);
            setPotionSize(stringToJson(data.potionSize).crowd);
            setPotionSwitch(stringToJson(data.potionSize).unit);
            setWorkTime(stringToJson(data.workTime).crowd);
            setWorkSwitch(stringToJson(data.workTime).unit);
            setCookingTime(stringToJson(data.cookingTime).crowd);
            setCookSwitch(stringToJson(data.cookingTime).unit);
            handleDataChange('isFetched', false)
        }
    }, [data.isFetched])



    React.useEffect(() => {
        if (title.length >= 0) {
            handleDataChange('title', title);
        }
    }, [title]);

    React.useEffect(() => {
        if (potionSize.length >= 0) {
            let value = potionSwitch
            if (potionSize >= 2) {
                value += 'en';
            }
            console.log(value)
            handleDataChange('potionSize', jsonToString(potionSize, value));
        }
    }, [potionSize]);

    React.useEffect(() => {
        if (workTime.length >= 0) {
            handleDataChange('workTime', jsonToString(workTime, workSwitch));
        }
    }, [workTime]);

    React.useEffect(() => {
        if (cookingTime.length >= 0) {
            handleDataChange('cookingTime', jsonToString(cookingTime, cookSwitch));
        }
    }, [cookingTime]);

    React.useEffect(() => {
        if (cookingTime) {
            // console.log(cookingTime)
            handleDataChange('cookingTime', jsonToString(cookingTime, cookSwitch));
        }
    }, [cookSwitch]);

    React.useEffect(() => {
        if (workTime) {
            handleDataChange('workTime', jsonToString(workTime, workSwitch));
        }
    }, [workSwitch]);

    React.useEffect(() => {
        if (potionSize) {
            let value = potionSwitch;
            if (potionSize >= 2) {
                value += 'en';
            }
            console.log(value)
            handleDataChange('potionSize', jsonToString(potionSize, value));
        }
    }, [potionSwitch]);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={handleBackgroundPress}>
                    <View style={styles.container}>
                        {/* <Button title='Klick mich' onPress={() => { getAllKeys().then((data) => { console.log(data) }); }} /> */}
                        <OverviewInput title={'title'} titleValue={title} setValue={setTitle} inputRef={inputRef} />
                        <View style={styles.chipContainer} >
                            <Text>Rezeptart:</Text>
                            <ReceptChips title={'types'} handleDataChange={handleDataChange} selectedChips={data?.chipType} />
                        </View>
                        <View style={styles.chipContainer}>
                            <Text>Kategorie:</Text>
                            <ReceptChips title={'category'} handleDataChange={handleDataChange} selectedChips={data?.chipsCategory} />
                        </View>
                        <View style={styles.chipContainer}>
                            <Text>Sammlungen:</Text>
                            <ReceptChips title={'collection'} handleDataChange={handleDataChange} selectedChips={data?.chipsCollection} />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginTop: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <OverviewInput title={'potion'} titleValue={potionSize} setValue={setPotionSize} inputRef={inputRef} />
                                <Switcher title={potionSwitch} setSwitch={setPotionSwitch} prop={'potion'} many={potionSize >= 2} howMany={potionSize} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <OverviewInput title={'work'} titleValue={workTime} setValue={setWorkTime} inputRef={inputRef} />
                                <Switcher title={workSwitch} setSwitch={setWorkSwitch} prop={'work'} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <OverviewInput title={'cook'} titleValue={cookingTime} setValue={setCookingTime} inputRef={inputRef} />
                                <Switcher title={cookSwitch} setSwitch={setCookSwitch} prop={'cook'} />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
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