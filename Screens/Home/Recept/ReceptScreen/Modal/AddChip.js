import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Chip } from 'react-native-paper';
import { List, Checkbox, Dialog, Paragraph, Button } from 'react-native-paper';




function addToArray(setArray, variable, title) {
    setArray([...variable, title]);
}

export default function AddChip({ setArray, variable, title }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    return (
        <View>
            <Modal
                style={{ backgroundColor: '#e1e1e1' }}
                animationType="slide"
                transparent={true}
                // onDismiss={setModalVisible(false)}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Füge eine {title} hinzu:</Text>
                        <TextInput
                            style={{ marginTop: 16, color: 'black' }}
                            placeholder={title + ' ...'}
                            placeholderTextColor={'black'}
                            onChangeText={text => setInputValue(text)}
                        />
                        <View style={{ flexDirection: "row", marginTop: 20 }}>
                            <Button onPress={() => { addToArray(setArray, variable, inputValue), setModalVisible(false), setInputValue('') }}>Speichern</Button>
                            <Button onPress={() => { setModalVisible(false), setInputValue('') }}>Abbrechen</Button>
                        </View>

                    </View>
                </View>
            </Modal>
            <Chip
                mode="outlined"
                style={[{ width: 'auto', height: 40, borderRadius: 25, margin: 6, justifyContent: 'center' }, { backgroundColor: '#e1e1e1' }]}
                selected={false}
            // onPress={() => { }}
            >
                <TouchableOpacity
                    style={{}}
                    onPress={() => { setModalVisible(true) }}>
                    <Icon name="add" size={20} color="black" />
                </TouchableOpacity>
            </Chip>
        </View>
    );

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});