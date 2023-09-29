import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Dialog, Divider, Menu } from 'react-native-paper';
import HeaderRightNav from './headerRightNav';




export default function HeaderRightSet({ title, navigation }) {
    const [visible, setVisible] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

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
                        console.log(title)
                        navigation.navigate('AddRecept', { title: `${title} bearbeiten`, recept: title });
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
            </Menu>
            <HeaderRightNav
                title={title}
                navigation={navigation}
                openDialog={openDialog}
                handleOpenDialog={handleOpenDialog}
                handleCloseDialog={handleCloseDialog} />
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
