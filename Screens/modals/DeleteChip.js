import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Chip } from 'react-native-paper';
import { List, Checkbox, Dialog, Paragraph, Button } from 'react-native-paper';




function deleteItem(setArray, variable, title) {
    setArray(variable.filter(item => item !== title));

}

export default function DeleteChip({ setArray, variable, selected, setModal, variableModal }) {
    const [inputValue, setInputValue] = React.useState('');
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                // onDismiss={setModalVisible(false)}
                visible={variableModal}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModal(!variableModal);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Bist du sicher, dass "{selected}" gelöscht werden soll?</Text>
                        <View style={{ flexDirection: "row", marginTop: 20 }}>
                            <Button onPress={() => { deleteItem(setArray, variable, selected), setModal(false) }}>Löschen</Button>
                            <Button onPress={() => { setModal(false) }}>Abbrechen</Button>
                        </View>

                    </View>
                </View>
            </Modal>
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