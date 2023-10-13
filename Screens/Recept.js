import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Card, Text, Dialog, Button, Chip, ActivityIndicator, useTheme } from 'react-native-paper';
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
function RenderChips({ chips, potion }) {
    if (typeof chips === 'string') {
        return (
            <Chip
                // key={index}
                mode="outlined"
                style={[{ width: 'auto', height: 30, borderRadius: 25, margin: 6 }, { backgroundColor: 'rgb(232,225,237)' }]}
                selected={true}
            >
                <Text>{JSON.parse(chips).crowd}{potion && ' '}{JSON.parse(chips).unit}</Text>
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
    const theme = useTheme();


    const { title } = route.params;
    useFocusEffect(
        React.useCallback(() => {
            fetchData(title, setRecepts, setIsLoading);
        }, []),
    );
    const navigation = useNavigation();


    return (
        <View style={{ flex: 1, padding: 8 }}>
            <ScrollView >
                {isLoading ?
                    (
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <ActivityIndicator animating={true} size={240} color={theme.colors.primary} />
                        </View>

                    ) : (
                        <View>
                            <View>
                                <Image style={{ width: '100%', height: 240, borderRadius: 10 }} source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 16, marginBottom: 16 }}>
                                <View style={{ width: '50%' }}>
                                    <Text style={{ fontSize: 26 }}>Zutaten:</Text>
                                </View>
                                <View style={{ width: '50%' }}>
                                    <Text style={{ fontSize: 26 }}>Zubereitung:</Text>
                                </View>
                            </View>
                            {recepts.description.receptArray.map((item, index) =>
                                <View key={index}>
                                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.5)' }}><Text style={{ textAlign: 'center', fontSize: 22 }}>{item.title}</Text></View>
                                    <View style={{ flexDirection: 'row', padding: 8 }}>
                                        <View style={{ width: '50%', minHeight: 250 }}>
                                            {item.ingredients.map((ingred, index) =>
                                                <Text key={index} style={{ fontSize: 18 }}>{ingred}</Text>
                                            )}
                                        </View>
                                        <View style={{ width: '50%' }}>
                                            <Text style={{ fontSize: 18 }} key={index}>{recepts.description.preparation[item.title]}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 24 }}>
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
                                        <RenderChips chips={recepts.description.potionSize} potion={true} />
                                    </View>
                                </View>
                            </View>
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