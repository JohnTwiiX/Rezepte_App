import React from 'react';
import { View } from 'react-native';
import { Button, Menu, Divider } from 'react-native-paper';
import { useData } from '../modals/DataProvider';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeMenu({ navigation }) {
    const [visible, setVisible] = React.useState(false);
    const { data, updateData } = useData();

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false);

    const handleDataChange = () => {
        const updatedData = { ...data };
        updatedData['isEditMode'] = !data.isEditMode;
        updateData(updatedData);
    };

    return (
        <View>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Icon name="menu-outline" size={25} onPress={openMenu} />}
            >
                <Menu.Item leadingIcon='pencil' onPress={() => { handleDataChange(); closeMenu() }} title="Bubbles bearbeiten" />
                <Divider />
                <Menu.Item leadingIcon='cog' onPress={() => { navigation.navigate('Settings'); closeMenu() }} title="Zu den Einstellungen" />
            </Menu>
        </View>
    );
}