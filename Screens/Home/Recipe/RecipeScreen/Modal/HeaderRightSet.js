import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import { Divider, Menu } from 'react-native-paper';
import HeaderRightNav from './HeaderRightNav';





export default function HeaderRightSet({ title, navigation }) {
    const [visible, setVisible] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openBasketDialog, setOpenBasketDialog] = useState(false);


    const openMenu = () => {
        setVisible(true);
    };

    const closeMenu = () => {
        setVisible(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenBasketDialog = () => {
        setOpenBasketDialog(true);
    };

    const handleCloseBasketDialog = () => {
        setOpenBasketDialog(false);
    };


    return (
        <View>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Icon name="menu-outline" size={25} onPress={openMenu} />}
            >
                <Menu.Item
                    leadingIcon='pencil-outline'
                    title="Bearbeiten"
                    onPress={() => {
                        navigation.navigate('AddRecipe', { title: `${title} bearbeiten`, recipe: title });
                        closeMenu();
                    }}
                >
                </Menu.Item>
                <Divider />
                <Menu.Item
                    leadingIcon='delete-outline'
                    title="Löschen"
                    onPress={() => { setOpenDialog(true); closeMenu() }}>
                </Menu.Item>
                <Divider />
                <Menu.Item
                    leadingIcon='basket'
                    title="Einkaufsliste"
                    onPress={() => {
                        setOpenBasketDialog(true); closeMenu()
                    }}>
                </Menu.Item>
            </Menu>
            <HeaderRightNav
                title={title}
                navigation={navigation}
                openDialog={openDialog}
                handleOpenDialog={handleOpenDialog}
                handleCloseDialog={handleCloseDialog}
                openBasketDialog={openBasketDialog}
                handleOpenBasketDialog={handleOpenBasketDialog}
                handleCloseBasketDialog={handleCloseBasketDialog} />
        </View>
    );
}

// const styles = StyleSheet.create({
//     menuItem: {
//         display: 'flex',
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
// })
