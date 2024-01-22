import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFromDatabase, saveToDatabase } from "../../utils/Firestore";

export function getKeysToKeep() {
    return ['types', 'category', 'collection', 'sections', 'recipes', 'recipeTypes', '@name', '@basket', '@basketFinished', '@basketItems', '@checkedRecipes', '@theme', '@userWithDB'];
}

export async function saveArrayStorage(key, value) {
    try {
        const valueString = JSON.stringify(value);
        await AsyncStorage.setItem(key, valueString);
        const user = await getTextFromStorage('@userWithDB');
        const keys = getKeysToKeep();
        if (user && keys.includes(key)) {
            saveToDatabase(key, valueString);
        }
    } catch (e) {
        console.error(e);
    }
}
export async function saveTextStorage(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
        const user = await getTextFromStorage('@userWithDB');
        const keys = getKeysToKeep();
        if (user && keys.includes(key)) {
            saveToDatabase(key, value);
        }
    } catch (e) {
        console.error(e);
    }
}

export async function getArrayFromStorage(key) {
    try {
        const user = await getTextFromStorage('@userWithDB');
        const keys = getKeysToKeep();
        if (user && keys.includes(key)) {
            return await getFromDatabase(key);
        } else {
            const value = await AsyncStorage.getItem(key);
            return value != null ? JSON.parse(value) : null
        }

    } catch (e) {
        // read error
    }
}

export async function getTextFromStorage(key) {
    try {
        const user = await getTextFromStorage('@userWithDB');
        const keys = getKeysToKeep().filter(key => key !== '@userWithDB');
        if (user && keys.includes(key)) {
            return await getFromDatabase(key, true);
        } else {
            const value = await AsyncStorage.getItem(key);
            return value
        }
    } catch (e) {
        // read error
    }
}

export async function multiRemoveKeys(keys) {
    try {
        await AsyncStorage.multiRemove(keys);
    } catch (e) {
        // remove error
    }
}

export async function getAllKeys() {
    try {
        return AsyncStorage.getAllKeys();
    } catch (e) {
        // remove error
    }
}

export async function multiGetStorage(keys) {
    try {
        return await AsyncStorage.multiGet(keys);
    } catch (e) {
        // remove error
    }
}

export async function deleteKey(key) {
    try {
        return await AsyncStorage.removeItem(key);
    } catch (e) {
        // remove error
    }
}
