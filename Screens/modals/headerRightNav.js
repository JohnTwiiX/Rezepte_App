import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, Modal } from 'react-native';
import { Button, Dialog, Divider, PaperProvider } from 'react-native-paper';
import { useData } from './DataProvider';


async function deleteReceptStorage(title) {
    try {
        let jsonValue = await AsyncStorage.getItem('recepts');
        if (jsonValue !== null) {
            const recepts = JSON.parse(jsonValue);
            const filteredRecepts = recepts.filter(recept => recept.title !== title);
            // Save the updated array back to AsyncStorage
            await AsyncStorage.setItem('recepts', JSON.stringify(filteredRecepts));
        }
    } catch (error) {
        console.error(error);
        // Handle error
    };
    console.log(title);
}

export default function HeaderRightNav({ title, navigation, openDialog, handleOpenDialog, handleCloseDialog, openBasketDialog, handleOpenBasketDialog, handleCloseBasketDialog }) {
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [visibleBasketDialog, setVisibleBasketDialog] = useState(false);
    const { data, updateData } = useData();

    React.useEffect(() => {
        if (openDialog) {
            setVisibleDialog(true);
            handleOpenDialog(); // Diese Funktion wird aufgerufen, um den Wert in der HeaderRightSet-Komponente zurückzugeben
        }
    }, [openDialog, handleOpenDialog]);

    React.useEffect(() => {
        if (openBasketDialog) {
            setVisibleBasketDialog(true);
            handleOpenBasketDialog(); // Diese Funktion wird aufgerufen, um den Wert in der HeaderRightSet-Komponente zurückzugeben
        }
    }, [openBasketDialog, handleOpenBasketDialog]);

    const closeDialog = () => {
        setVisibleDialog(false);
        handleCloseDialog();
    };
    const closeBasketDialog = () => {
        setVisibleBasketDialog(false);
        handleCloseBasketDialog();
    };

    const deleteAndCloseDialog = async () => {
        await deleteReceptStorage(title);
        closeDialog();
        navigation.goBack()
    };

    const handleDataChange = () => {
        const updatedData = { ...data };
        updatedData['inBasket'] = true;
        updateData(updatedData);
    };

    const saveToBasket = async () => {
        handleDataChange();
        closeBasketDialog();
    };



    return (
        <View style={{ flexDirection: 'row' }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visibleDialog || visibleBasketDialog}
                onRequestClose={closeDialog}
            >
                < Dialog visible={visibleDialog} onDismiss={() => closeDialog()}>
                    <Dialog.Content>
                        <Text> Möchtest du das Rezept löschen? </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            deleteReceptStorage(title);
                            deleteAndCloseDialog();
                        }}>Ja</Button>
                        <Button onPress={() => { closeDialog() }}>Nein</Button>
                    </Dialog.Actions>
                </Dialog >
                < Dialog visible={visibleBasketDialog} onDismiss={() => closeBasketDialog()}>
                    <Dialog.Content>
                        <Text> Möchtest du dieses Rezept in deine Einkaufsliste hinzufügen? </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            saveToBasket();
                        }}>Ja</Button>
                        <Button onPress={() => { closeBasketDialog() }}>Nein</Button>
                    </Dialog.Actions>
                </Dialog >
            </Modal>
        </View>
    );
}
