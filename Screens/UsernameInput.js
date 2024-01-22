import * as React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { saveTextStorage } from './modals/StorageService';

export default function UsernameInput({ setUpdate }) {
    const [text, setText] = React.useState('');
    const theme = useTheme()

    const handleTextChange = (text) => {
        // remove non-letter characters except German and Norwegian umlauts
        const filteredText = text.replace(/[^a-zA-ZäöüÄÖÜßæøåÆØÅ]/g, '');
        setText(filteredText);
    };

    const handleSaveUsername = async () => {
        await saveTextStorage('@name', text);
        setUpdate(true)
    }

    const handleBackgroundPress = () => {
        // Minimiere das Keyboard, wenn irgendwo anders auf dem Bildschirm geklickt wird
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={handleBackgroundPress}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Gib zuerst deinen Namen an:</Text>
                    <TextInput
                        label={'Name'}
                        maxLength={10}
                        value={text}
                        onChangeText={handleTextChange}
                        onSubmitEditing={handleSaveUsername}
                        style={[styles.input, { backgroundColor: theme.input }]}
                    />
                    <Button mode='elevated' onPress={handleSaveUsername}>OK</Button>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        backgroundColor: '#edebe4',
        padding: 32,
        borderRadius: 10
    },
    text: {
        marginBottom: 8
    },
    input: {
        marginTop: 8,
        marginBottom: 32
    }
});
