import firestore from '@react-native-firebase/firestore';
import { getTextFromStorage } from '../Screens/modals/StorageService';

export async function saveToDatabase(doc, item) {
    const user = await getUser();
    const objItem = {
        doc: item
    }
    if (user) {
        const usersCollection = firestore().collection(user);
        usersCollection.doc(doc).set(objItem);
    } else {
        console.error('Benutzer nicht gefunden.');
    }
}

export async function getFromDatabase(doc, text) {
    const user = await getUser();
    if (user) {
        const usersCollection = firestore().collection(user);
        const result = await usersCollection.doc(doc).get();
        if (text) {
            return result.data().doc;
        } else {
            return JSON.parse(result.data().doc);
        }

    } else {
        console.error('Benutzer nicht gefunden.');
        return null;
    }
}

async function getUser() {
    try {
        const user = await getTextFromStorage('@userWithDB');
        return user || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}
