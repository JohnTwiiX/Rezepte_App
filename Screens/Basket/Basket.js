import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import BasketItem from './BasketItem';
import { useFocusEffect } from '@react-navigation/native';
import { readDB } from '../modals/firestoreService';


export default function BasketScreen({ route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [basketArray, setBasket] = React.useState([]);
    const { user } = route.params

    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true);
        }, []),);

    React.useEffect(() => {
        async function fetchData() {
            const basketStorage = await readDB('@basket', user.username);
            if (basketStorage.data() !== undefined) {
                console.log('bin drin');
                setBasket(basketStorage.data());
            }
            setIsLoading(false);
        };
        fetchData();
    }, [isLoading]);

    return (
        <View style={{ height: '100%' }}>
            {isLoading ?
                <View style={styles.emptyContainer}>
                    <ActivityIndicator animating={true} size={240} />
                </View>
                : basketArray.length === 0 ?
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Deine Einkaufsliste ist leer!</Text>
                        <Text style={styles.smallText}>Füge Rezepte hinzu.</Text>
                    </View>
                    :
                    <BasketItem item={basketArray} setIsLoading={setIsLoading} user={user} />
            }
        </View >

    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        fontSize: 26,
        fontWeight: 'bold'
    },
    smallText: {
        textAlign: 'center',
        color: 'rgba(0,0,0,0.5)',
        fontSize: 16
    }
})