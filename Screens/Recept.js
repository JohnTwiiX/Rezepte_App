import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Card, Text, Dialog, Button, Chip } from 'react-native-paper';
import { getStorage } from './ReceptScreen/Overview';

async function fetchData(title, setRecepts) {
    const data = await getStorage('recepts');
    if (data) {
        const mainDishes = data.filter(recept => recept.description?.receptType?.includes(title) || recept.description?.collection?.includes(title));
        setRecepts(mainDishes);
    }
}



export default function ReceptScreen({ route }) {
    const [selectedChips, setSelectedChips] = React.useState([]);

    const { title } = route.params;
    // useFocusEffect(
    //     React.useCallback(() => {
    //         fetchData(title, setRecepts);
    //     }, []),
    // );



    return (
        <View style={{ flex: 1 }}>
            <Text>Hallo hier bei {title}</Text>
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