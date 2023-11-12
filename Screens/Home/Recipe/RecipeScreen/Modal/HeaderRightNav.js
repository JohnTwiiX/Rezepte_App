import React, { useState } from 'react';
import { Text, View, Modal } from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import { useData } from '../../../../modals/DataProvider';
import { getArrayFromStorage, saveArrayStorage } from '../../../../modals/StorageService';


async function deleteRecipeStorage(title) {
    try {
        let recipes = await getArrayFromStorage('recipes');
        if (recipes !== null) {
            const filteredRecipes = recipes.filter(recipe => recipe.title !== title);
            // Save the updated array back to AsyncStorage
            await saveArrayStorage('recipes', filteredRecipes);
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
        await deleteRecipeStorage(title);
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
                            deleteRecipeStorage(title);
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
