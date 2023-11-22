import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Image, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Avatar, Card, Text, Dialog, Chip, useTheme, FAB } from 'react-native-paper';
import { useData } from '../../modals/DataProvider';
import { getArrayFromStorage } from '../../modals/StorageService';

async function fetchData(title, setRecipes) {
    const data = await getArrayFromStorage('recipes');
    if (data) {
        const mainDishes = data.filter(recipe => recipe.description?.recipeType?.includes(title) || recipe.description?.collection?.includes(title));
        setRecipes(mainDishes);
    }
}

async function fetchChips(recipes, setCategoryChips, setWorkChips, setCookChips, setSizeChips) {
    const uniqueCategory = new Set();
    const uniqueWork = new Set();
    const uniqueCook = new Set();
    const uniqueSize = new Set();
    recipes.map((recipe) => {
        recipe.description.category.forEach((category) => {
            if (!uniqueCategory.has(category)) {
                uniqueCategory.add(category);
            }
        });
        uniqueWork.add(recipe.description.workTime);
        uniqueCook.add(recipe.description.cookingTime);
        uniqueSize.add(recipe.description.potionSize);
    });
    setCategoryChips(Array.from(uniqueCategory));
    setWorkChips(Array.from(uniqueWork));
    setCookChips(Array.from(uniqueCook));
    setSizeChips(Array.from(uniqueSize));
}

function RenderRecipes(props) {
    const navigation = useNavigation();
    return props.recipes.map((recipe, index) => {
        const potionSize = JSON.parse(recipe.description.potionSize);
        const workTime = JSON.parse(recipe.description.workTime);
        const cookingTime = JSON.parse(recipe.description.cookingTime);
        return (
            <TouchableOpacity
                style={{ margin: 8 }}
                key={index}
                onPress={() => navigation.navigate('Recipe', { title: recipe.title, category: props.title })}>
                <Card >
                    <Card.Content>
                        <View style={{ flexDirection: 'row' }}>
                            {recipe.description.imgUri?.length >= 1
                                ?
                                <Avatar.Image size={50} source={{ uri: recipe.description.imgUri }} />
                                :
                                <Avatar.Image size={50} source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} />
                            }
                            <View style={{ marginLeft: 15 }}>
                                <Text style={[styles.text, { fontSize: 28 }]}>{recipe.title}</Text>
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



function filterRecipes(recipes, selectedChips) {
    // Initialize an empty array to store the filtered recipes
    const filteredRecipes = [];
    // Iterate through all the recipes
    for (const recipe of recipes) {
        // Iterate through all the selected chips
        for (const chip of selectedChips) {
            // Check if the recipe contains the chip in its description
            if (recipe.description.category.includes(chip) ||
                recipe.description.workTime.includes(chip) ||
                recipe.description.cookingTime.includes(chip) ||
                recipe.description.potionSize.includes(chip)) {
                // If it does, add it to the filtered recipes array
                filteredRecipes.push(recipe);
                // Break out of the inner loop to avoid adding the same recipe multiple times
                break;
            }
        }
    }
    // Return the filtered recipes array
    return filteredRecipes;
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
    const [recipes, setRecipes] = React.useState([]);
    const [visibleDialog, setVisibleDialog] = React.useState(false);
    const [filteredRecipes, setFilteredRecipes] = React.useState([]);
    const { title } = route.params;
    const { deleteData } = useData();
    const theme = useTheme();
    useFocusEffect(
        React.useCallback(() => {
            fetchData(title, setRecipes);
            deleteData();
        }, []),
    );
    React.useEffect(() => {
        fetchChips(recipes, setCategoryChips, setWorkChips, setCookChips, setSizeChips);
    }, [recipes]);
    React.useEffect(() => {
        setFilteredRecipes(filterRecipes(recipes, selectedChips));
    }, [selectedChips]);

    React.useEffect(() => {
        if (route.params?.showDialog) {
            setVisibleDialog(true);
            // Reset showDialog after opening the dialog
            navigation.setParams({ showDialog: false });
        }
    }, [route.params?.showDialog]);

    return (
        <ImageBackground style={{ paddingTop: 55 }} resizeMode="cover" blurRadius={10} source={theme.backgroundImage} >
            <View style={{ height: '100%' }}>
                {/* <Image style={styles.img} blurRadius={10} source={theme.backgroundImage} /> */}
                <ScrollView>
                    <View>
                        {selectedChips.length === 0 ? <RenderRecipes recipes={recipes} title={title} /> : <RenderRecipes recipes={filteredRecipes} title={title} />}
                    </View>
                </ScrollView>
                <FAB
                    icon="plus"
                    style={[styles.fab, { backgroundColor: theme.button }]}
                    onPress={() => navigation.navigate('AddRecipe', { title: 'Rezept erstellen', chip: title })}
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
        </ImageBackground>
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
    text: {
        marginBottom: 8,
        fontFamily: 'Garnet Regular'
    },
    img: {
        height: '100%',
        width: '100%'
    }
});