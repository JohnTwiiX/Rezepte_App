import * as React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Card, Text, Dialog, Button, Chip, ActivityIndicator, useTheme } from 'react-native-paper';
import { getStorage } from './ReceptScreen/Overview';
import { ScrollView as GHScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReceptMinDrawer from './modals/ReceptMinDrawer';
import ReceptMaxDrawer from './modals/ReceptMaxDrawer';


const icons = ['clock-time-two-outline', 'pot-mix-outline']

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



export default function ReceptScreen({ route }) {
    const screenWidth = Dimensions.get('window').width;
    const [isLoading, setIsLoading] = React.useState(true);
    const [recepts, setRecepts] = React.useState({});
    const [crowdResult, setCrowdResult] = React.useState(0)
    const [crowd, setCrowd] = React.useState(0);
    const theme = useTheme();

    const { title } = route.params;
    useFocusEffect(
        React.useCallback(() => {
            fetchData(title, setRecepts, setIsLoading);
        }, []),
    );

    const plusCrowd = () => {
        const newCrowd = crowd + 1;
        console.log(newCrowd);
        setCrowd(newCrowd);
        setCrowdResult(newCrowd);
    }

    const minusCrowd = () => {
        const newCrowd = crowd - 1;
        console.log(newCrowd);
        setCrowd(newCrowd);
        setCrowdResult(newCrowd);
    }

    const handleCrow = (crows) => {
        let filterCrowd = crows[0];
        if (typeof filterCrowd === Number) filterCrowd = parseInt(crows[0]);
        if (crows[1] === ' ') {
            if (crowdResult === 0) {
                return `${filterCrowd} ${crows[2]} ${crows[4]}`
            } else if (crowd === -1) {
                return `${filterCrowd / 2} ${crows[2]} ${crows[4]}`
            } else {
                return `${filterCrowd * (crowd + 1)} ${crows[2]} ${crows[4]}`
            }
        } else {
            if (crowdResult === 0) {
                return `${filterCrowd} ${crows[1]} ${crows[3]}`
            } else if (crowd === -1) {
                return `${filterCrowd / 2} ${crows[1]} ${crows[3]}`
            } else {
                return `${filterCrowd * (crowd + 1)} ${crows[1]} ${crows[3]}`
            }
        }
    }

    return (
        <View style={{ flex: 1, padding: 8, height: '100%' }}>
            <ScrollView >
                {isLoading ?
                    (
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <ActivityIndicator animating={true} size={240} color={theme.colors.primary} />
                        </View>
                    ) : (
                        <View>
                            <View>
                                {recepts.description.imgUri?.length >= 1 ?
                                    <Image style={{ width: '100%', height: 240, borderRadius: 10 }} source={{ uri: recepts.description.imgUri }} />
                                    :
                                    <Image style={{ width: '100%', height: 240, borderRadius: 10 }} source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} />
                                }

                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                                    <View style={styles.m_8}>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <RenderChips chips={recepts.description.workTime} type={'work'} />
                                        </View>
                                    </View>
                                    <View style={styles.m_8}>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <RenderChips chips={recepts.description.cookingTime} type={'cook'} />
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.m_8, { alignItems: 'center' }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name='minus' size={16} onPress={minusCrowd} />
                                        <RenderChips chips={recepts.description.potionSize} type={'potion'} crowd={crowd} />
                                        <Icon name='plus' size={16} onPress={plusCrowd} />
                                    </View>
                                </View>
                            </View>
                            {screenWidth <= 1080 ? (
                                <ReceptMinDrawer recepts={recepts} handleCrow={handleCrow} />
                            ) : (
                                <ReceptMaxDrawer recepts={recepts} handleCrow={handleCrow} />
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