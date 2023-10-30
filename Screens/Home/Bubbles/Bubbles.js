import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { Dialog, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { defaultCollection, defaultTypes } from '../../Home/Recept/ReceptScreen/Modal/ReceptChips';
import { useData } from '../../modals/DataProvider';
import EditBubblePos, { getIndex } from './EditBubblePos';
import { getArrayFromStorage, multiGetStorage, saveArrayStorage } from '../../modals/StorageService';

const defaultSizes = [130, 160, 200];

function getRandomSize() {
    var randomIndex = Math.floor(Math.random() * defaultSizes.length);
    return defaultSizes[randomIndex];
}

function CircleButton({ descr, size, onPress, onLongPress, editMode, selectedItem }) {
    const theme = useTheme();
    return (
        <TouchableOpacity
            onLongPress={onLongPress}
            onPress={onPress}
            style={[
                { margin: 8, backgroundColor: theme.colors.color, width: size, height: size, borderRadius: size },
                editMode && descr === selectedItem ? { borderWidth: 10, borderColor: theme.colors.button } : {}
            ]}>
            <View style={styles.innerView}>
                <Text style={styles.text}>{descr}</Text>
            </View>
        </TouchableOpacity>
    );
}

async function deleteBubble(descr, setUpdate) {
    let values = await fetchBubbles();
    values.forEach(async ([key, value]) => {
        const parsedValue = value;
        if (parsedValue.includes(descr)) {
            const updatedArray = parsedValue.filter(item => item !== descr);

            await saveArrayStorage(key, updatedArray);

            setUpdate(true);
        }
    })
}



async function fetchBubbles() {
    let values = await multiGetStorage(['types', 'collection']);
    return values
}

async function changeBubbleSize(size, receptTypes, item, setUpdate) {
    const index = getIndex(receptTypes, item);
    const newSizeArray = receptTypes.map((element, i) => {
        if (i === index) {
            return { ...element, size: size };
        } else {
            return element;
        }
    });
    await saveArrayStorage('receptTypes', newSizeArray);
    setUpdate(true);
}

async function fetchData(setReceptTypes) {
    try {
        fetchBubbles().then(async (data) => {
            let bubbles = [];
            if (data[1][1] === null && data[1][1] === null) {
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
            let fetchedTypes = await getArrayFromStorage('receptTypes');
            if (fetchedTypes === null) {
                const bubbleArray = []
                for (let i = 0; i < bubbles.length; i++) {
                    const bubble = {
                        title: bubbles[i],
                        size: getRandomSize()
                    }
                    bubbleArray.push(bubble);
                }
                saveArrayStorage('receptTypes', bubbleArray);
                setReceptTypes(bubbleArray);
                return;
            }
            fetchedTypes = fetchedTypes;
            if (bubbles.length === fetchBubbles.length && bubbles.every(item => fetchedTypes.some(bubble => bubble.title === item))) {
                // All items are in the same order
                setReceptTypes(fetchedTypes);
            } else {
                if (fetchedTypes.length > bubbles.length) {
                    // Remove items from fetchedTypes that are not in bubbles
                    fetchedTypes = fetchedTypes.filter(item => bubbles.includes(item.title));
                } else {
                    // Add new items from bubbles to fetchedTypes
                    bubbles.forEach(item => {
                        if (!fetchedTypes.some(bubble => bubble.title === item)) {
                            const bubble = {
                                title: item,
                                size: getRandomSize()
                            }
                            fetchedTypes.push(bubble);
                        }
                    });
                }
                // console.log('bin hier da ein neues Item drin ist... ', fetchedTypes);
                saveArrayStorage('receptTypes', fetchedTypes);
                setReceptTypes(fetchedTypes);
            }
        })
    } catch (e) {
        // read error
        console.log(e);
    }
}

export default function CircleButtons({ update, setUpdate }) {
    const [receptTypes, setReceptTypes] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [visibleSize, setVisibleSize] = React.useState(false);
    const { data } = useData();
    const theme = useTheme();
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
    }, [update]);

    const navigation = useNavigation();
    return (
        <View style={data.isEditMode ? { borderWidth: 5, borderColor: theme.colors.button } : {}}>
            {data && data.isEditMode && <View style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}><Text style={{ textAlign: 'center', fontSize: 18, color: 'rgba(0,0,0,0.8)' }}>Verändere deine Bubbles in der Position/Größe.</Text></View>}
            <ScrollView >
                <View style={styles.container}>
                    {receptTypes ? receptTypes.map((bubble, index) =>
                        <View key={index}>
                            <CircleButton
                                descr={bubble.title}
                                size={bubble.size}
                                onPress={() => data.isEditMode ?
                                    setSelectedItem(bubble.title)
                                    :
                                    navigation.navigate('Category', { title: bubble.title })}
                                onLongPress={() => {
                                    setSelectedItem(bubble.title);
                                    data.isEditMode ? setVisibleSize(true) : setVisible(true);
                                }}
                                editMode={data.isEditMode}
                                selectedItem={selectedItem}
                            />
                            {data.isEditMode && <Text key={index} style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.5)', margin: 8 }}>Position {index + 1}.</Text>}
                        </View>)
                        :
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <ActivityIndicator animating={true} size={240} />
                        </View>}
                </View>
            </ScrollView>
            {data.isEditMode && selectedItem && <EditBubblePos arr={receptTypes} setUpdate={setUpdate} item={selectedItem} />}
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Content>
                    <Text style={{ fontSize: 22 }}>Bist du sicher, dass "{selectedItem}" gelöscht werden soll?</Text>
                </Dialog.Content>
                <Dialog.Actions >
                    <Button onPress={() => { deleteBubble(selectedItem, setUpdate); setVisible(false) }}>Löschen</Button>
                    <Button onPress={() => { setVisible(false) }}>Abbrechen</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog visible={visibleSize} onDismiss={() => setVisibleSize(false)}>
                <Dialog.Content>
                    <Text style={{ fontSize: 22 }}>Wähle eine Größe</Text>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: 'space-around' }}>
                    <Button mode='outlined' onPress={() => { changeBubbleSize(130, receptTypes, selectedItem, setUpdate); setVisibleSize(false) }}>Klein</Button>
                    <Button mode='outlined' onPress={() => { changeBubbleSize(160, receptTypes, selectedItem, setUpdate); setVisibleSize(false) }}>Mittel</Button>
                    <Button mode='outlined' onPress={() => { changeBubbleSize(200, receptTypes, selectedItem, setUpdate); setVisibleSize(false) }}>Groß</Button>
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

