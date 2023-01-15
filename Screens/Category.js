import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Button, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Card, Text } from 'react-native-paper';
import { getStorage } from './ReceptScreen/Overview';



export default function CategoryScreen({ route }) {
    const [recepts, setRecepts] = React.useState([]);
    const { title } = route.params;
    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                const data = await getStorage('recepts');
                if (data) {
                    const mainDishes = data.filter(recept => recept.description?.receptType?.includes(title) || recept.description?.collection?.includes(title));
                    console.log(data[2].description.collection)
                    setRecepts(mainDishes);
                }
            }
            fetchData();
        }, []),
    );


    return (
        <ScrollView>
            <View style={{}}>
                <Text>Hallo hier bei {title}</Text>
            </View>
            <View>
                {recepts.map((recept, index) =>
                    <TouchableOpacity key={index} onPress={() => console.log('Ich bin Rezept ', recept.title)}>
                        <Card >
                            {/* <Card.Cover source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} /> */}
                            <Card.Content>
                                <View style={{ flexDirection: 'row' }}>
                                    <Avatar.Image size={50} source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} />
                                    <View style={{ marginLeft: 15 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{recept.title}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text>{recept.description.potionSize}</Text>
                                            <Text>  |  </Text>
                                            <Text>{recept.description.workTime}</Text>
                                            <Text>  |  </Text>
                                            <Text>{recept.description.cookingTime}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
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