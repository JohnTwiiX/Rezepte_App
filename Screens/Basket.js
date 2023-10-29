import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { getStorage } from './ReceptScreen/Overview';
import BasketItem from './modals/BasketItem';
import { useFocusEffect } from '@react-navigation/native';


export default function BasketScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [basketArray, setBasket] = React.useState([]);

    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true);
        }, []),);

    React.useEffect(() => {
        async function fetchData() {
            const basketStorage = await getStorage('@basket');
            if (basketStorage !== null) {
                setBasket(basketStorage);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [isLoading]);

    return (
        <View style={{ height: '100%' }}>
            {isLoading ?
                <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <ActivityIndicator animating={true} size={240} />
                </View>
                : basketArray.length === 0 ?
                    <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Dein Warankorb ist leer!</Text>
                    </View>
                    :
                    <BasketItem item={basketArray} setIsLoading={setIsLoading} />
            }
        </View >

    );
}