import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import Switcher from './Modal/Switcher';
import { useData } from '../../../modals/DataProvider';
import OverviewInput from './Modal/OverviewInput';
import RecipeChips from './Modal/RecipeChips';

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

export default function Overview({ route }) {
    const [title, setTitle] = React.useState("");
    const [potionSize, setPotionSize] = React.useState("");
    const [workTime, setWorkTime] = React.useState("");
    const [cookingTime, setCookingTime] = React.useState("");
    const [workSwitch, setWorkSwitch] = React.useState("min");
    const [cookSwitch, setCookSwitch] = React.useState("min");
    const [potionSwitch, setPotionSwitch] = React.useState("Person");
    const inputRef = React.useRef(null);
    const { data, updateData } = useData();
    const { user } = route.params

    const handleBackgroundPress = () => {
        // Minimiere das Keyboard, wenn irgendwo anders auf dem Bildschirm geklickt wird
        Keyboard.dismiss();
    };

    const handleDataChange = (dataValue, newValue) => {
        if (newValue) {
            // Erstelle ein neues Objekt, das eine Kopie der aktuellen Daten enthält
            const updatedData = { ...data };
            // Aktualisiere das Objekt mit dem neuen Wert für den angegebenen Schlüssel (dataValue)
            updatedData[dataValue] = newValue;
            // Aktualisiere die Daten im Kontext mit dem aktualisierten Objekt
            updateData(updatedData);
        }
    };

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
                        <OverviewInput title={'title'} titleValue={title} setValue={setTitle} inputRef={inputRef} />
                        <View style={styles.chipContainer} >
                            <Text>Rezeptart:</Text>
                            <RecipeChips title={'types'} handleDataChange={handleDataChange} selectedChips={data?.types} user={user} />
                        </View>
                        <View style={styles.chipContainer}>
                            <Text>Kategorie:</Text>
                            <RecipeChips title={'category'} handleDataChange={handleDataChange} selectedChips={data?.category} user={user} />
                        </View>
                        <View style={styles.chipContainer}>
                            <Text>Sammlungen:</Text>
                            <RecipeChips title={'collection'} handleDataChange={handleDataChange} selectedChips={data?.collection} user={user} />
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