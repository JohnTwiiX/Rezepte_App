import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, FAB, TextInput, useTheme } from 'react-native-paper';
import BasketItem from './BasketItem';
import { useFocusEffect } from '@react-navigation/native';
import { getArrayFromStorage, saveArrayStorage } from '../modals/StorageService';


export default function BasketScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [basketArray, setBasket] = React.useState([]);
    const [basketArrayItems, setBasketItems] = React.useState([]);
    const theme = useTheme();
    const [visible, setVisible] = React.useState(false);
    const [text, setText] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true);
        }, []),);

    React.useEffect(() => {
        async function fetchData() {
            const basketStorage = await getArrayFromStorage('@basket');
            const basketItemsStorage = await getArrayFromStorage('@basketItems');
            if (basketStorage !== null) {
                setBasket(basketStorage);
            }
            if (basketItemsStorage !== null) {
                setBasketItems(basketItemsStorage);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [isLoading]);

    const addItemToBasket = async () => {
        let oldBasketArray = await getArrayFromStorage('@basketItems');
        if (oldBasketArray === null) {
            let basketArray = [text]
            await saveArrayStorage('@basketItems', basketArray);
        } else {
            oldBasketArray.push(text);
            await saveArrayStorage('@basketItems', oldBasketArray);
        }
        setVisible(!visible);
        setText('');
        setIsLoading(true);
    }

    return (
        <View style={{ height: '100%' }}>
            {isLoading ?
                <View style={styles.emptyContainer}>
                    <ActivityIndicator animating={true} size={240} />
                </View>
                : basketArray.length === 0 && basketArrayItems.length === 0 ?
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Deine Einkaufsliste ist leer!</Text>
                        <Text style={styles.smallText}>Füge Rezepte hinzu.</Text>
                    </View>
                    :
                    <BasketItem item={basketArray} setIsLoading={setIsLoading} basketItems={basketArrayItems} />
            }
            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.button }]}
                onPress={() => setVisible(true)}
            />
            <Dialog visible={visible} onDismiss={() => setVisible(!visible)}>
                <Dialog.Title>Füge etwas zur Einkaufsliste hinzu.</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label='Artikel'
                        value={text}
                        onChangeText={text => setText(text)}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => { addItemToBasket() }}>Hinzufügen</Button>
                    <Button onPress={() => setVisible(!visible)}>Abbrechen</Button>
                </Dialog.Actions>
            </Dialog>
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
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
})