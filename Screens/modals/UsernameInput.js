import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { Dialog, Button, RadioButton, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function saveInStorage(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error(e);
    }
}

export default function UsernameInput({ setUpdate }) {
    const [text, setText] = React.useState('');

    const handleTextChange = (text) => {
        // remove non-letter characters except German and Norwegian umlauts
        const filteredText = text.replace(/[^a-zA-ZäöüÄÖÜßæøåÆØÅ]/g, '');
        setText(filteredText);
    };

    const handleSaveUsername = async () => {
        await saveInStorage('@name', text);
        setUpdate(true)
    }

    return (
        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View>
                <Text style={{ marginBottom: 8 }}>Gib zuerst deinen Namen an:</Text>
                <TextInput
                    label={'Name'}
                    maxLength={10}
                    value={text}
                    onChangeText={handleTextChange}
                    onSubmitEditing={handleSaveUsername}
                />
                <Button mode='elevated' onPress={handleSaveUsername}>OK</Button>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

});
