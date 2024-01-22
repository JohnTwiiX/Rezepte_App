import firestore from '@react-native-firebase/firestore';
import { getTextFromStorage } from '../Screens/modals/StorageService';
const usersCollection = firestore().collection(getUser());

async function getUser() {
    try {
        const user = await getTextFromStorage('@userWithDB');
        if (user) return user
    } catch (error) {
        console.error(error);
    }
}

export function saveToDatabase(doc, item) {
    usersCollection
        .doc(doc)
        .set(item);
}

export async function getFromDatabase(doc) {
    await usersCollection
        .doc(doc)
        .get().then((result) => {
            return result.data();
        });
}

