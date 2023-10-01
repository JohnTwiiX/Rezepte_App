import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Card, Text, Dialog, Button, Chip, useTheme } from 'react-native-paper';
import { getStorage } from './ReceptScreen/Overview';

async function fetchData(title, setRecepts) {
    const data = await getStorage('recepts');
    if (data) {
        const mainDishes = data.filter(recept => recept.description?.receptType?.includes(title) || recept.description?.collection?.includes(title));
        setRecepts(mainDishes);
    }
}

async function fetchChips(recepts, setCategoryChips, setWorkChips, setCookChips, setSizeChips) {
    // let values
    // try {
    //     values = await AsyncStorage.getItem('Kategorie');
    // } catch (e) {
    //     // read error
    // }

    // setCategoryChips(JSON.parse(values));

    const uniqueCategory = new Set();
    const uniqueWork = new Set();
    const uniqueCook = new Set();
    const uniqueSize = new Set();
    recepts.map((recept) => {
        recept.description.category.forEach((category) => {
            if (!uniqueCategory.has(category)) {
                uniqueCategory.add(category);
            }
        });
        uniqueWork.add(recept.description.workTime);
        uniqueCook.add(recept.description.cookingTime);
        uniqueSize.add(recept.description.potionSize);
    });
    setCategoryChips(Array.from(uniqueCategory));
    setWorkChips(Array.from(uniqueWork));
    setCookChips(Array.from(uniqueCook));
    setSizeChips(Array.from(uniqueSize));


    // const uniqueValues = new Set(values);
    // recepts.map((recept) => {
    //     uniqueValues.add(recept.description.workTime);
    //     uniqueValues.add(recept.description.cookingTime);
    //     uniqueValues.add(recept.description.potionSize);
    // });
    // setCategoryChips(Array.from(uniqueValues));
}

function RenderRecepts(props) {
    const navigation = useNavigation();
    return props.recepts.map((recept, index) => {
        return (
            <TouchableOpacity
                style={{ margin: 8 }}
                key={index}
                onPress={() => navigation.navigate('Recept', { title: recept.title, category: props.title })}>
                <Card >
                    {/* <Card.Cover source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} /> */}
                    <Card.Content>
                        <View style={{ flexDirection: 'row' }}>
                            <Avatar.Image size={50} source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} />
                            <View style={{ marginLeft: 15 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{recept.title}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name='account-outline' size={18} style={{ marginRight: 4 }} />
                                    <Text>{recept.description.potionSize}</Text>
                                    <Text>  |  </Text>
                                    <Icon name='clock-time-two-outline' size={18} style={{ marginRight: 4 }} />
                                    <Text>{recept.description.workTime}</Text>
                                    <Text>  |  </Text>
                                    <Icon name='pot-steam-outline' size={18} style={{ marginRight: 4 }} />
                                    <Text>{recept.description.cookingTime}</Text>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    });
}
function RenderChips({ chips, selectedChips, setSelectedChips }) {
    const theme = useTheme()
    return chips.map((item, index) => {
        return (
            <Chip
                key={index}
                textStyle={selectedChips.includes(item) ? { color: theme.colors.chip.active.color } : 'black'}
                mode="outlined" style={[{ width: 'auto', height: 50, borderRadius: 25, margin: 6 }, selectedChips.includes(item) ? { backgroundColor: theme.colors.chip.active.bgColor } : { backgroundColor: theme.colors.chip.passive }]}
                // onLongPress={() => { setSelectedChips([type]), setModalVisible(true) }}
                selected={false}
                onPress={() => {
                    if (selectedChips.includes(item)) {
                        setSelectedChips(selectedChips.filter((type) => type !== item));
                    } else {
                        setSelectedChips([...selectedChips, item]);
                    }
                }}
            >
                {item}
            </Chip>
        );
    });
}



function filterRecepts(recepts, selectedChips) {
    // Initialize an empty array to store the filtered recepts
    const filteredRecepts = [];
    // Iterate through all the recepts
    for (const recept of recepts) {
        // Iterate through all the selected chips
        for (const chip of selectedChips) {
            // Check if the recept contains the chip in its description
            if (recept.description.category.includes(chip) ||
                recept.description.workTime.includes(chip) ||
                recept.description.cookingTime.includes(chip) ||
                recept.description.potionSize.includes(chip)) {
                // If it does, add it to the filtered recepts array
                filteredRecepts.push(recept);
                // Break out of the inner loop to avoid adding the same recept multiple times
                break;
            }
        }
    }
    // Return the filtered recepts array
    return filteredRecepts;
}

let openDialog = false;

export function setDialogVisible() {

    openDialog = true
}



export default function CategoryScreen({ navigation, route }) {
    const [selectedChips, setSelectedChips] = React.useState([]);
    const [categoryChips, setCategoryChips] = React.useState([]);
    const [workChips, setWorkChips] = React.useState([]);
    const [cookChips, setCookChips] = React.useState([]);
    const [sizeChips, setSizeChips] = React.useState([]);
    const [recepts, setRecepts] = React.useState([]);
    const [visibleDialog, setVisibleDialog] = React.useState(false);
    const [filteredRecepts, setFilteredRecepts] = React.useState([]);
    const { title } = route.params;
    useFocusEffect(
        React.useCallback(() => {
            fetchData(title, setRecepts);
        }, []),
    );
    React.useEffect(() => {
        fetchChips(recepts, setCategoryChips, setWorkChips, setCookChips, setSizeChips);
    }, [recepts]);
    React.useEffect(() => {
        setFilteredRecepts(filterRecepts(recepts, selectedChips));
    }, [selectedChips]);

    React.useEffect(() => {
        console.log('wird getriggert')
        if (route.params?.showDialog) {
            console.log('öffnet Dialog')
            setVisibleDialog(true);
            // Reset showDialog after opening the dialog
            navigation.setParams({ showDialog: false });
        }
    }, [route.params?.showDialog]);

    return (
        <View style={{ flex: 1 }}>
            {/* <View >
                <TouchableOpacity
                    onPress={() => { setVisibleDialog(true) }}>
                    <Text>Filtern nach</Text>
                </TouchableOpacity>

            </View> */}
            <ScrollView>
                <View>
                    {selectedChips.length === 0 ? <RenderRecepts recepts={recepts} title={title} /> : <RenderRecepts recepts={filteredRecepts} title={title} />}
                </View>
            </ScrollView>
            {/* Dialog um eine Meldung anzuzeigen ##################################################################### */}
            <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
                <Dialog.Content>
                    {/* <Text style={{ fontSize: 22 }}>Hallo, du willst filtern?</Text> */}
                    <View >
                        <Text>Kategorie: </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={categoryChips} selectedChips={selectedChips} setSelectedChips={setSelectedChips} />
                        </View>
                        <Text>Arbeitszeit: </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={workChips} selectedChips={selectedChips} setSelectedChips={setSelectedChips} />
                        </View>
                        <Text>Kochzeit: </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={cookChips} selectedChips={selectedChips} setSelectedChips={setSelectedChips} />
                        </View>
                        <Text>Portionsgröße: </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={sizeChips} selectedChips={selectedChips} setSelectedChips={setSelectedChips} />
                        </View>

                    </View>
                </Dialog.Content>
                {/* <Dialog.Actions>
                    <Button onPress={() => { setRecepts(filterRecepts(recepts, selectedChips)), setVisibleDialog(false) }}>filtern</Button>
                    <Button onPress={() => { setVisibleDialog(false) }}>abbrechen</Button>
                </Dialog.Actions> */}
            </Dialog>
        </View>
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