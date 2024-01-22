import * as React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, TextInput, useTheme, Text } from 'react-native-paper';
import { saveTextStorage } from '../modals/StorageService';
import { firebase } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';


export default function Registration() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const theme = useTheme();
    const navigation = useNavigation();

    const handleRegister = () => {
        if (email.trim() === '' || password.trim() === '') {
            alert('Bitte geben Sie eine E-Mail-Adresse und ein Passwort ein.');
            return;
        }
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await saveTextStorage('@userWithDB', user);
                console.log('Registrierung erfolgreich:', user.email);
                navigation.navigate('Home');
            })
            .catch((error) => {
                console.log(error);
                alert('Registrierung fehlgeschlagen: ' + error.message);
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
                        <Text variant='titleLarge' style={styles.text}>Registrierung</Text>
                        <Button onPress={() => navigation.navigate('Login')}>zum Login</Button>
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
                        onSubmitEditing={handleRegister}
                        style={[styles.input, { backgroundColor: theme.input }]}
                    />
                    <Button mode='elevated' onPress={handleRegister}>Registrieren</Button>
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
