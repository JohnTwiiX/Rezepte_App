import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, TextInput, Text, Snackbar } from 'react-native-paper';
import { getTextFromStorage, saveTextStorage } from '../../modals/StorageService';
import { useFocusEffect } from '@react-navigation/core';


const themes = ['ThemeAutumn', 'ThemeWinter']
export default function SettingsScreen({ navigation, setUpdate }) {
    const [text, setText] = React.useState('');
    const [chip, setChip] = React.useState('');
    const [visible, setVisible] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            loadThemeChip();
            loadName();
        }, []),);

    const loadThemeChip = async () => {
        const theme = await getTextFromStorage('@theme');
        if (theme) setChip(theme);
    };

    const loadName = async () => {
        const name = await getTextFromStorage('@name');
        if (name) setText(name);
    };

    const handleTextChange = (text) => {
        // remove non-letter characters except German and Norwegian umlauts
        const filteredText = text.replace(/[^a-zA-ZäöüÄÖÜßæøåÆØÅ]/g, '');
        setText(filteredText);
    };

    const handleSaveUsername = async () => {
        await saveTextStorage('@name', text);
    }
    const handleSaveTheme = async () => {
        await saveTextStorage('@theme', chip);
    }

    const saveSettings = () => {
        handleSaveUsername();
        handleSaveTheme();
        setUpdate(true);
    }

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);
    return (
        <View style={{}}>
            <View style={styles.m16}>
                <Text variant="headlineMedium" >Ändere deinen Namen</Text>
                <TextInput
                    style={styles.m16}
                    label={'Ändere den Namen'}
                    maxLength={10}
                    value={text}
                    onChangeText={handleTextChange}
                />
            </View>

            <View style={styles.m16}>
                <Text variant="headlineMedium">Wähle dein Theme</Text>
                <View style={{ flexDirection: 'row' }}>
                    {themes.map((theme, i) => (
                        <Chip key={i}
                            style={styles.m16}
                            selected={chip === theme}
                            onPress={() => setChip(theme)}
                        >
                            {theme}
                        </Chip>
                    ))}
                </View>
            </View>
            <Button onPress={saveSettings}>Speichern</Button>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={3000}
            >
                Deine Einstellungen wurden gespeichert
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    m16: {
        margin: 16
    }
})