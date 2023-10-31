import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Avatar, Card, Text, Dialog, Chip, useTheme, FAB } from 'react-native-paper';
import { useData } from '../../modals/DataProvider';
import { getArrayFromStorage } from '../../modals/StorageService';

async function fetchData(title, setRecepts) {
    const data = await getArrayFromStorage('recepts');
    if (data) {
        const mainDishes = data.filter(recept => recept.description?.receptType?.includes(title) || recept.description?.collection?.includes(title));
        setRecepts(mainDishes);
    }
}

async function fetchChips(recepts, setCategoryChips, setWorkChips, setCookChips, setSizeChips) {
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
}

function RenderRecepts(props) {
    const navigation = useNavigation();
    return props.recepts.map((recept, index) => {
        const potionSize = JSON.parse(recept.description.potionSize);
        const workTime = JSON.parse(recept.description.workTime);
        const cookingTime = JSON.parse(recept.description.cookingTime);
        return (
            <TouchableOpacity
                style={{ margin: 8 }}
                key={index}
                onPress={() => navigation.navigate('Recept', { title: recept.title, category: props.title })}>
                <Card >
                    <Card.Content>
                        <View style={{ flexDirection: 'row' }}>
                            {recept.description.imgUri?.length >= 1
                                ?
                                <Avatar.Image size={50} source={{ uri: recept.description.imgUri }} />
                                :
                                <Avatar.Image size={50} source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} />
                            }

                            <View style={{ marginLeft: 15 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{recept.title}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name='account-outline' size={18} style={{ marginRight: 4 }} />
                                    <Text>{potionSize.crowd} {potionSize.unit}</Text>
                                    <Text>  |  </Text>
                                    <Icon name='clock-time-two-outline' size={18} style={{ marginRight: 4 }} />
                                    <Text>{workTime.crowd}{workTime.unit}</Text>
                                    <Text>  |  </Text>
                                    <Icon name='pot-mix-outline' size={18} style={{ marginRight: 4 }} />
                                    <Text>{cookingTime.crowd}{cookingTime.unit}</Text>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    });
}
function RenderChips({ chips, selectedChips, setSelectedChips, type }) {
    const theme = useTheme()
    return chips.map((item, index) => {
        return (
            <Chip
                key={index}
                textStyle={selectedChips.includes(item) ? { color: theme.chip.active.color } : 'black'}
                mode="outlined"
                style={[{ width: 'auto', height: 50, borderRadius: 25, margin: 6, justifyContent: 'center' }, selectedChips.includes(item) ? { backgroundColor: theme.chip.active.bgColor } : { backgroundColor: theme.chip.passive }]}
                selected={false}
                onPress={() => {
                    if (selectedChips.includes(item)) {
                        setSelectedChips(selectedChips.filter((type) => type !== item));
                    } else {
                        setSelectedChips([...selectedChips, item]);
                    }
                }}
            >
                {type && item}
                {!type && `${JSON.parse(item).crowd} ${JSON.parse(item).unit}`}
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
    const { deleteData } = useData();
    const theme = useTheme();
    useFocusEffect(
        React.useCallback(() => {
            fetchData(title, setRecepts);
            deleteData();
        }, []),
    );
    React.useEffect(() => {
        fetchChips(recepts, setCategoryChips, setWorkChips, setCookChips, setSizeChips);
    }, [recepts]);
    React.useEffect(() => {
        setFilteredRecepts(filterRecepts(recepts, selectedChips));
    }, [selectedChips]);

    React.useEffect(() => {
        if (route.params?.showDialog) {
            setVisibleDialog(true);
            // Reset showDialog after opening the dialog
            navigation.setParams({ showDialog: false });
        }
    }, [route.params?.showDialog]);

    return (
        <View style={{ backgroundColor: theme.color, height: '100%' }}>
            <ScrollView>
                <View>
                    {selectedChips.length === 0 ? <RenderRecepts recepts={recepts} title={title} /> : <RenderRecepts recepts={filteredRecepts} title={title} />}
                </View>
            </ScrollView>
            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.button }]}
                onPress={() => navigation.navigate('AddRecept', { title: 'Rezept erstellen', chip: title })}
            />
            {/* Dialog um eine Meldung anzuzeigen ##################################################################### */}
            <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
                <Dialog.Content>
                    <View >
                        <Text>Kategorie: </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={categoryChips} selectedChips={selectedChips} setSelectedChips={setSelectedChips} type={true} />
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
            </Dialog>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8
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
        marginBottom: 8
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});