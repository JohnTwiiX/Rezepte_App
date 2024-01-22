import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, TextInput, Text, useTheme } from 'react-native-paper';
import { getTextFromStorage, saveTextStorage } from '../../modals/StorageService';
import { useFocusEffect, useNavigation } from '@react-navigation/core';


const themes = ['ThemeAutumn', 'ThemeWinter', 'ThemeSpring', 'ThemeSummer', 'ThemePurple']
export default function SettingsScreen({ setUpdate }) {
    const [text, setText] = React.useState('');
    const [chip, setChip] = React.useState('');
    const [edit, setEdit] = React.useState(true);
    const [createdDB, setCreatedDB] = React.useState(false);
    const theme = useTheme();
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            loadThemeChip();
            loadName();
            userHasDB();
            setEdit(true);
        }, []),);

    const loadThemeChip = async () => {
        const theme = await getTextFromStorage('@theme');
        if (theme) setChip(theme);
    };

    const loadName = async () => {
        const name = await getTextFromStorage('@name');
        if (name) setText(name);
    };

    const userHasDB = async () => {
        const db = await getTextFromStorage('@userWithDB');
        if (db) setCreatedDB(true);
    };

    const handleTextChange = (text) => {
        setEdit(false);
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

    const handleThemetext = (theme) => {
        if (theme === 'ThemeWinter') return 'Winterliches Theme'
        if (theme === 'ThemeAutumn') return 'Herbstliches Theme'
        if (theme === 'ThemeSpring') return 'Frühlingshaftes Theme'
        if (theme === 'ThemeSummer') return 'Sommerliches Theme'
        if (theme === 'ThemePurple') return 'Lilahaftes Theme'
    }

    return (
        <View style={{}}>
            <View style={styles.m16}>
                <Text variant="headlineMedium" >Ändere deinen Namen</Text>
                <TextInput
                    style={[styles.m16, { backgroundColor: theme.input }]}
                    label={'Ändere den Namen'}
                    maxLength={10}
                    value={text}
                    onChangeText={handleTextChange}
                />
            </View>

            <View style={styles.m16}>
                <Text variant="headlineMedium">Wähle dein Theme</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {themes.map((themeItem, i) => (
                        <Chip key={i}
                            style={[styles.m16, { backgroundColor: theme.chip.active.bgColor }]}
                            selected={chip === themeItem}
                            onPress={() => { setChip(themeItem); setEdit(false); }}
                        >
                            {handleThemetext(themeItem)}
                        </Chip>
                    ))}
                </View>
            </View>
            {createdDB &&
                <Button style={styles.m16} onPress={() => navigation.navigate('Login')}>zum Login</Button>
            }
            <View style={styles.buttonContainer}>
                <Button disabled={edit} mode='outlined' onPress={saveSettings}>Speichern</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    m16: {
        margin: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    }
})