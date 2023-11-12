import * as React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Text, Chip, ActivityIndicator, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RecipeMinDrawer from './RecipeScreen/Modal/RecipeMinDrawer';
import RecipeMaxDrawer from './RecipeScreen/Modal/RecipeMaxDrawer';
import { useData } from '../../modals/DataProvider';
import { getArrayFromStorage, saveArrayStorage } from '../../modals/StorageService';

async function fetchData(title, setRecipes, setIsLoading) {
    setIsLoading(true);
    const data = await getArrayFromStorage('recipes');
    if (data) {
        const mainDishes = data.find(recipe => recipe.title?.includes(title));
        setRecipes(mainDishes);
        setIsLoading(false);
        // console.log(mainDishes.description.category)
    }
}
function RenderChips({ chips, type, crowd }) {
    if (typeof chips === 'string') {
        let value = JSON.parse(chips).crowd
        let valueInt = parseInt(value)
        let result = valueInt + crowd
        // console.log(result)
        let cookWork = false;
        if (type === 'work' || type === 'cook') cookWork = true;
        return (
            <Chip
                // key={index}
                mode="outlined"
                style={[{ width: 'auto', height: 34, borderRadius: 25, margin: 6 }, { backgroundColor: 'rgb(232,225,237)' }]}>
                <View style={{ flexDirection: 'row' }}>
                    {type === 'work' && <Icon name={'clock-time-two-outline'} size={20} color='rgba(0, 0, 0, 0.3)' style={{ marginRight: 8 }} />}
                    {type === 'cook' && <Icon name={'pot-mix-outline'} size={20} color='rgba(0, 0, 0, 0.3)' style={{ marginRight: 8 }} />}
                    <Text>{cookWork && JSON.parse(chips).crowd}{type === 'potion' && result}{type === 'potion' && ' '}{JSON.parse(chips).unit}</Text>
                </View>

            </Chip>
        )
    } if (chips) {
        return chips.map((item, index) => {
            return (
                <Chip
                    key={index}
                    mode="outlined"
                    style={[{ width: 'auto', height: 30, borderRadius: 25, margin: 6 }, { backgroundColor: 'rgb(232,225,237)' }]}
                    selected={true}>
                    {item}
                </Chip>
            );
        });
    }
}



export default function RecipeScreen({ route }) {
    const screenWidth = Dimensions.get('window').width;
    const [isLoading, setIsLoading] = React.useState(true);
    const [recipes, setRecipes] = React.useState({});
    const [crowdResult, setCrowdResult] = React.useState(0)
    const [crowd, setCrowd] = React.useState(0);
    const theme = useTheme();
    const { data, updateData } = useData();

    const handleDataChange = () => {
        const updatedData = { ...data };
        updatedData['inBasket'] = false;
        updateData(updatedData);
    };

    React.useEffect(() => {
        if (data.inBasket) {
            async function saveInBasket() {
                const basketItem = {
                    title: recipes.title,
                    ingred: recipes.description.recipeArray,
                    potion: recipes.description.potionSize,
                    crowd: crowd,
                    uri: recipes.description.imgUri
                };
                let oldBasketArray = await getArrayFromStorage('@basket');
                if (oldBasketArray === null) {
                    let basketArray = [basketItem]
                    await saveArrayStorage('@basket', basketArray);
                } else {
                    oldBasketArray.push(basketItem);
                    await saveArrayStorage('@basket', oldBasketArray);
                }
                handleDataChange();
            };
            saveInBasket();
        }
    }, [data.inBasket])

    const { title } = route.params;
    useFocusEffect(
        React.useCallback(() => {
            fetchData(title, setRecipes, setIsLoading);
        }, []),
    );

    const plusCrowd = () => {
        const newCrowd = crowd + 1;
        setCrowd(newCrowd);
        setCrowdResult(newCrowd);
    }

    const minusCrowd = () => {
        const newCrowd = crowd - 1;
        setCrowd(newCrowd);
        setCrowdResult(newCrowd);
    }

    const handleCrow = (crows) => {
        const stringPotion = JSON.parse(recipes.description.potionSize).crowd
        const newPotion = parseInt(stringPotion) + crowd;
        let filterCrowd = crows[0];
        let result = (filterCrowd / parseInt(stringPotion) * newPotion).toFixed(2).replace(".", ",");

        if (result.endsWith(",00")) {
            result = result.replace(",00", "");
        }
        if (typeof filterCrowd === Number) filterCrowd = parseInt(crows[0]);
        if (crows[1] === ' ') {
            return `${result} ${crows[2]} ${crows[4]}`
        } else {
            return `${result}${crows[1]} ${crows[3]}`
        }
    }

    return (
        <View style={{ padding: 8, height: '100%' }}>
            <ScrollView style={{ height: '100%' }}>
                {isLoading ?
                    (
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <ActivityIndicator animating={true} size={240} color={theme.primary} />
                        </View>
                    ) : (
                        <View style={{ height: '100%' }}>
                            <View>
                                {recipes.description.imgUri?.length >= 1 ?
                                    <Image style={{ width: '100%', height: 240, borderRadius: 10 }} source={{ uri: recipes.description.imgUri }} />
                                    :
                                    <Image style={{ width: '100%', height: 240, borderRadius: 10 }} source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} />
                                }

                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                    <View style={styles.m_8}>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <RenderChips chips={recipes.description.workTime} type={'work'} />
                                        </View>
                                    </View>
                                    <View style={styles.m_8}>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <RenderChips chips={recipes.description.cookingTime} type={'cook'} />
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.m_8, { alignItems: 'center' }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name='minus' size={16} onPress={minusCrowd} />
                                        <RenderChips chips={recipes.description.potionSize} type={'potion'} crowd={crowd} />
                                        <Icon name='plus' size={16} onPress={plusCrowd} />
                                    </View>
                                </View>
                            </View>
                            {screenWidth <= 1080 ? (
                                <RecipeMinDrawer recipes={recipes} handleCrow={handleCrow} />
                            ) : (
                                <RecipeMaxDrawer recipes={recipes} handleCrow={handleCrow} />
                            )}

                        </View>
                    )
                }
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    m_8: {
        margin: 4
    },

});