import * as React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, TextInput, useTheme, Text } from 'react-native-paper';
import { saveTextStorage } from '../modals/StorageService';
import { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';


export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const theme = useTheme();
    const navigation = useNavigation();



    const handleLogin = () => {
        if (email.trim() === '' || password.trim() === '') {
            alert('Bitte geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein.');
            return;
        }

        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await saveTextStorage('@userWithDB', user);
                console.log('Anmeldung erfolgreich:', user.email);
                navigation.navigate('Home');
            })
            .catch((error) => {
                alert('Anmeldung fehlgeschlagen: ' + error.message);
            });
    };

    const handleBackgroundPress = () => {
        // Minimiere das Keyboard, wenn irgendwo anders auf dem Bildschirm geklickt wird
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={handleBackgroundPress}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text variant='titleLarge' style={styles.text}>Login</Text>
                        <Button onPress={() => navigation.navigate('Registration')}>registrieren</Button>
                    </View>
                    <TextInput
                        label={'Email'}
                        keyboardType='email-address'
                        value={email}
                        onChangeText={text => { setEmail(text) }}
                        style={[styles.input, { backgroundColor: theme.input }]}
                    />
                    <TextInput
                        label={'Passwort'}
                        value={password}
                        secureTextEntry
                        onChangeText={text => { setPassword(text) }}
                        onSubmitEditing={handleLogin}
                        style={[styles.input, { backgroundColor: theme.input }]}
                    />
                    <Button mode='elevated' onPress={handleLogin}>Einloggen</Button>
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
        width: '100%'
    },
    inputContainer: {
        backgroundColor: '#edebe4',
        padding: 32,
        borderRadius: 10,
        width: '80%'
    },
    text: {
        // marginBottom: 8
    },
    input: {
        marginTop: 8,
        marginBottom: 32
    }
});
