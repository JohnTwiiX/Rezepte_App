import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, Modal } from 'react-native';
import { Button, Dialog, Divider, PaperProvider } from 'react-native-paper';


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

export default function HeaderRightNav({ title, navigation, openDialog, handleOpenDialog, handleCloseDialog }) {
    const [visibleDialog, setVisibleDialog] = useState(false);

    React.useEffect(() => {
        if (openDialog) {
            setVisibleDialog(true);
            handleOpenDialog(); // Diese Funktion wird aufgerufen, um den Wert in der HeaderRightSet-Komponente zurückzugeben
        }
    }, [openDialog, handleOpenDialog]);

    const closeDialog = () => {
        setVisibleDialog(false);
        handleCloseDialog();
    };

    const deleteAndCloseDialog = async () => {
        await deleteReceptStorage(title);
        closeDialog();
        navigation.goBack()
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <Modal

                animationType="slide"
                transparent={true}
                visible={visibleDialog}
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
            </Modal>
        </View>
    );
}
