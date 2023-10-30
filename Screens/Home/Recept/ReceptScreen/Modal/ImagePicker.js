import React from 'react';
import { View, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import { useData } from '../../../../modals/DataProvider';
import { Button, Divider, Menu } from 'react-native-paper';



export default function ImagePickerIcon() {
    const [visible, setVisible] = React.useState(false);
    const { data, updateData } = useData();

    const handleDataChange = (newValue) => {
        if (newValue) {
            // Erstelle ein neues Objekt, das eine Kopie der aktuellen Daten enthält
            const updatedData = { ...data };
            // Aktualisiere das Objekt mit dem neuen Wert für den angegebenen Schlüssel (dataValue)
            updatedData['imgUri'] = newValue;
            // Aktualisiere die Daten im Kontext mit dem aktualisierten Objekt
            updateData(updatedData);
        }
    };

    const openImagePicker = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error:', response.error);
            } else {
                handleDataChange(response.assets[0].uri);
            }
        });
    };
    const openCamera = () => {
        ImagePicker.launchCamera({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error:', response.error);
            } else {
                handleDataChange(response.assets[0].uri);
            }
        });
    };


    return (
        <View>
            {/* <Icon name="camera-plus-outline" size={25} onPress={openImagePicker} /> */}
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={<Icon name="camera-plus-outline" size={25} onPress={() => setVisible(true)} />}
            >
                <Menu.Item
                    title="Foto machen"
                    onPress={() => {
                        openCamera();
                        setVisible(false);
                    }}
                >
                </Menu.Item>
                <Divider />
                <Menu.Item
                    title="Aus der Galerie wählen"
                    onPress={() => {
                        openImagePicker();
                        setVisible(false)
                    }}>
                </Menu.Item>
            </Menu>
        </View>
    );
}
