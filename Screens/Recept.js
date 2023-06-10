import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Card, Text, Dialog, Button, Chip } from 'react-native-paper';
import { getStorage } from './ReceptScreen/Overview';

async function fetchData(title, setRecepts, setIsLoading) {
    setIsLoading(true);
    const data = await getStorage('recepts');
    if (data) {
        const mainDishes = data.find(recept => recept.title?.includes(title));
        setRecepts(mainDishes);
        setIsLoading(false);
        // console.log(mainDishes.description.category)
    }
}
function RenderChips({ chips }) {
    if (typeof chips === 'string') {
        return (
            <Chip
                // key={index}
                mode="outlined"
                style={[{ width: 'auto', height: 30, borderRadius: 25, margin: 6 }, { backgroundColor: 'rgb(232,225,237)' }]}
                selected={true}

            >
                {chips}
            </Chip>
        )
    } if (chips) {
        return chips.map((item, index) => {
            return (
                <Chip
                    key={index}
                    mode="outlined"
                    style={[{ width: 'auto', height: 30, borderRadius: 25, margin: 6 }, { backgroundColor: 'rgb(232,225,237)' }]}
                    selected={true}

                >
                    {item}
                </Chip>
            );
        });
    }
}



export default function ReceptScreen({ route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [recepts, setRecepts] = React.useState({});

    const { title } = route.params;
    useFocusEffect(
        React.useCallback(() => {
            fetchData(title, setRecepts, setIsLoading);
        }, []),
    );
    const navigation = useNavigation();


    return (
        <View style={{ flex: 1 }}>
            <View style={{}}>
                <Text style={{ textAlign: 'center' }}>{recepts.title}</Text>
            </View>
            <View>
                <TouchableOpacity style={{}}
                    onPress={() => navigation.navigate('AddRecept', { recept: title })}>
                    <Icon name="pencil" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View>
                {isLoading ?
                    (
                        <View>
                            <Text>No data to display</Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row' }}>
                            <ScrollView style={{ width: '50%', backgroundColor: 'yellow' }}>
                                <View >
                                    <View><Text>Zutaten:</Text>
                                        {recepts.description.receptArray.map((item, index) =>
                                            <View key={index}>
                                                <Text >{item.title}</Text>
                                                <View>
                                                    {item.ingredients.map((ingred, index) =>
                                                        // {ingred.map}
                                                        <Text key={index}>{ingred}</Text>
                                                    )}
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </ScrollView>
                            {recepts.description.preparation ? (
                                <ScrollView style={{ width: '50%' }}>
                                    <View style={{}}>
                                        <View><Text>Zubereitung:</Text>
                                            {recepts.description.receptArray.map((item, index) =>
                                                <View key={index}>
                                                    <Text

                                                        style={{ borderBottomColor: 'black', borderBottomWidth: 2 }}>{item.title}</Text>
                                                    <View>
                                                        <Text key={index}>{recepts.description.preparation[item.title]}</Text>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </ScrollView>
                            ) :
                                <View style={{ width: '50%' }}>
                                    <Text>No data to display</Text>
                                </View>
                            }
                        </View>
                    )
                }
            </View>
            {isLoading ? (
                <View style={{ width: '50%' }}>
                    <Text>No data to display</Text>
                </View>
            ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <View style={styles.m_8}>
                        <Text>Rezeptart:</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={recepts.description.receptType} />
                        </View>
                    </View>
                    <View style={styles.m_8}>
                        <Text>Kategorie:</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={recepts.description.category} />
                        </View>
                    </View>
                    <View style={styles.m_8}>
                        <Text>Sammlung:</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={recepts.description.collection} />
                        </View>
                    </View>
                    <View style={styles.m_8}>
                        <Text>Arbeitszeit:</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={recepts.description.workTime} />
                        </View>
                    </View>
                    <View style={styles.m_8}>
                        <Text>Kochzeit:</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={recepts.description.cookingTime} />
                        </View>
                    </View>
                    <View style={styles.m_8}>
                        <Text>Portionsgröße:</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <RenderChips chips={recepts.description.potionSize} />
                        </View>
                    </View>
                </View>
            )}

        </View >
    );
}

const styles = StyleSheet.create({
    m_8: {
        margin: 8
    },

});