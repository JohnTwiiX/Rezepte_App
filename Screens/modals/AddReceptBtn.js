import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { List, Modal, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';


export default function AddReceptBtn({ navigation }) {


    return (
        <View >
            <TouchableOpacity
                onPress={() => navigation.navigate('AddRecept', { title: 'Rezept erstellen' })}
                onLongPress={() => getrecepts()}>
                <Icon name="plus" size={20} color="black" />
            </TouchableOpacity>
        </View >
    );
}

export const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 16,
        right: 16,
        alignItems: 'center',
        backgroundColor: '#9a998c',
        padding: 10,
        borderRadius: 100,
        zIndex: 2
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
});