import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Chip } from 'react-native-paper';
import { List, Checkbox, Dialog, Paragraph, Button } from 'react-native-paper';




function addToArray(a) {

}

export default function AddChip({ array, title }) {
    const [selectedChips, setSelectedChips] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);


    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Chip
                mode="outlined"
                style={[{ width: 'auto', height: 50, borderRadius: 25, margin: 6 }, { backgroundColor: 'rgb(232,225,237)' }]}
                selected={false}
            // onPress={() => { }}
            >
                <TouchableOpacity
                    style={{}}
                    onPress={() => { setOpenDialog(true) }}>
                    <Icon name="add" size={20} color="black" />
                </TouchableOpacity>
            </Chip>
            <Dialog style={{ width: '100%', height: '100%' }} visible={openDialog} onDismiss={() => setOpenDialog(false)}>
                <Dialog.Title>Benenne deine {title}</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        placeholder={title}
                        onChangeText={text => setInputValue(text)}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => { addToArray(array) }}>Speichern</Button>
                    <Button onPress={() => { setOpenDialog(false) }}>Abbrechen</Button>
                </Dialog.Actions>
            </Dialog>

        </View>
    )

}