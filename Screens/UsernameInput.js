import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { saveInStorage, saveTextStorage } from './modals/StorageService';

export default function UsernameInput({ setUpdate }) {
    const [text, setText] = React.useState('');

    const handleTextChange = (text) => {
        // remove non-letter characters except German and Norwegian umlauts
        const filteredText = text.replace(/[^a-zA-ZäöüÄÖÜßæøåÆØÅ]/g, '');
        setText(filteredText);
    };

    const handleSaveUsername = async () => {
        await saveTextStorage('@name', text);
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
