import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveArrayStorage(key, value) {
    try {
        const valueString = JSON.stringify(value);
        await AsyncStorage.setItem(key, valueString);
    } catch (e) {
        console.error(e);
    }
}
export async function saveTextStorage(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error(e);
    }
}

export async function getArrayFromStorage(key) {
    try {
        const value = await AsyncStorage.getItem(key);
        return value != null ? JSON.parse(value) : null
    } catch (e) {
        // read error
    }
}

export async function getTextFromStorage(key) {
    try {
        const value = await AsyncStorage.getItem(key);
        return value
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
