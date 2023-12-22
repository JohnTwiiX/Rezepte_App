import firestore from '@react-native-firebase/firestore';
import { saveTextStorage } from './StorageService';

export function createItemDB(user, doc, item) {
    firestore()
        .collection(user)
        .doc(user)
        .collection(doc)
        .add(item)
}

export async function subItemDB(user, doc) {
    firestore()
        .collection(user)
        .doc(user)
        .collection(doc)
    // .onSnapshot(documentSnapshot => {
    //     // documentSnapshot.docs.map((recipe) => {
    //     //     console.log(recipe.data());
    //     //     console.log(recipe.id);
    //     // });
    // });

}

export function updateDB(doc1, doc2, user, item) {
    firestore()
        .collection(user)
        .doc(doc1)
        .collection(doc2)
        .doc(doc2)
        .update(item)
        .then(() => {
            console.log('User updated!');
        });
}

export function deleteDB(doc, user) {
    firestore()
        .collection(user)
        .doc(doc)
        .delete()
        .then(() => {
            console.log('User deleted!');
        });
}

export async function readDB(user, doc) {
    const result = await firestore()
        .collection(user)
        .doc(user)
        .collection(doc)
        .get();
    return result;
}