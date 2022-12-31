import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';

const receptTypes = ["Fisch", "Fleisch", "Kuchen", "Dessert", "Festtage", "", ""];
const sizes = [130, 160, 200];

function CircleButton({ descr, size, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}>
            <View style={styles.innerView}>
                <Text style={styles.text}>{descr}</Text>
            </View>
        </TouchableOpacity>
    );
}


export default function CircleButtons() {
    return (
        <ScrollView >
            <View style={styles.container}>
                {receptTypes.map((bubble, index) =>
                    <CircleButton
                        key={index}
                        descr={bubble}
                        size={sizes[index % sizes.length]}
                        onPress={() => console.log(`Button ${index + 1} ${bubble} gedrückt`)} />)}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        backgroundColor: '#0066cc',
        margin: 8
    },
    innerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: 20
    }
});

