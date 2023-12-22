import * as React from 'react';
import auth from '@react-native-firebase/auth';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Text, TextInput } from 'react-native-paper';
import { saveArrayStorage } from './modals/StorageService';

export default function Auth({ setUpdate }) {
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [page, setPage] = React.useState('Login');
    const [visible, setVisible] = React.useState(false);

    const signIn = async () => {
        try {
            const email = `${user}@rezept.de`;
            await auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
                const userUid = userCredential.user.uid;
                // Hier bist du authentifiziert und kannst die Firestore-Datenbank für diesen Benutzer verwenden.
                const userObj = {
                    username: user,
                    email: email,
                    password: password,
                    uid: userUid
                }
                saveArrayStorage('@user', userObj);
            })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error('Fehler bei der Anmeldung:', error);
        }
    };

    const signUp = async () => {
        try {
            const email = `${user}@rezept.de`
            await auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
                const userUid = userCredential.user.uid;
                // Hier bist du authentifiziert und kannst die Firestore-Datenbank für diesen Benutzer verwenden.
                const userObj = {
                    username: user,
                    email: email,
                    password: password,
                    uid: userUid
                }
                saveArrayStorage('@user', userObj);
            })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error('Fehler bei der Registrierung:', error);
        }
    };

    const getUser = async () => {
        const user = auth().currentUser;
        console.log(user);
    }

    const changePasswort = async () => {
        try {
            const email = `${user}@rezept.de`;
            const code = 'resetPasswort';
            auth().sendPasswordResetEmail(email, code).then((data) => {
                auth().confirmPasswordReset(code, password)
            })
        } catch (error) {
            console.error(error)
        }

    }

    const deleteAccountByEmail = async (email) => {
        try {
            // Finde den Benutzer mit der E-Mail-Adresse
            const userRecord = await auth().getUserByEmail(email);

            // Rufe das User-Objekt ab
            const user = auth().getUser(userRecord.uid);

            // Lösche das Benutzerkonto
            await auth().deleteUser(user.uid);

            console.log(`Benutzer mit der E-Mail ${email} wurde erfolgreich gelöscht.`);
        } catch (error) {
            console.error(`Fehler beim Löschen des Benutzers mit der E-Mail ${email}:`, error);
        }
    };

    return (
        <View style={styles.authConatiner}>
            <View style={styles.viewContainer}>
                {page === 'Login' ?
                    <View>
                        <View style={styles.header}>
                            <Button icon={'chevron-left'} onPress={() => setPage('')} >Registrieren</Button>
                        </View>
                        <Text variant="headlineLarge">Logge dich ein</Text>
                    </View>
                    :
                    <View>
                        <View style={styles.header}>
                            <Button icon={'chevron-left'} onPress={() => setPage('Login')} >Einloggen</Button>
                        </View>
                        <Text variant="headlineLarge">Registriere dich</Text>
                    </View>
                }
                <TextInput
                    placeholder='Benutzernamen'
                    style={{ backgroundColor: 'white', margin: 16 }}
                    onChangeText={(text) => setUser(text)}
                    value={user}
                />
                <TextInput
                    placeholder='Passwort'
                    style={{ backgroundColor: 'white', margin: 16 }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                {page === 'Login' ?
                    <View>
                        <Button onPress={signIn} >Login</Button>
                        <Button onPress={getUser} >User</Button>
                        {/* <Button onPress={() => setVisible(true)} >Passwort vergessen</Button> */}
                    </View>
                    :
                    <View>
                        <Button onPress={signUp} >Registrieren</Button>
                    </View>
                }
            </View>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Title>Passwort zurücksetzen?</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        placeholder='Benutzernamen'
                        style={{ backgroundColor: 'white', margin: 16 }}
                        onChangeText={(text) => setUser(text)}
                        value={user}
                    />
                    <TextInput
                        placeholder='Neues Passwort'
                        style={{ backgroundColor: 'white', margin: 16 }}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => { setVisible(false); changePasswort() }}>Speichern</Button>
                    <Button onPress={() => setVisible(false)}>Abbrechen</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    )
}

const styles = StyleSheet.create({
    authConatiner: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    viewContainer: {
        backgroundColor: 'white',
        width: '100%',
        padding: 24
    },
    header: {
        flexDirection: 'row'
    }
})