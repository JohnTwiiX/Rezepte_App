import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { Dialog, Button, Menu, Divider, Modal } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultCollection, defaultTypes } from './ReceptChips';
import { useData } from './DataProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import { saveInStorage } from '../ReceptScreen/Overview';

async function moveToStartEnd(arr, item, isStart, setUpdate) {
    const index = getIndex(arr, item);
    let element = arr.splice(index, 1)[0];
    if (isStart) {
        // Move item to start
        arr.unshift(element);
    } else {
        // Move item to end
        arr.push(element);
    }
    await saveInStorage('receptTypes', arr);
    setUpdate(true);
}

function moveToIndex(arr, fromIndex, toIndex) {
    let element = arr.splice(fromIndex, 1)[0];
    arr.splice(toIndex, 0, element);
    return arr;
}

async function moveUpDown(arr, item, isUp, setUpdate) {
    const index = getIndex(arr, item);
    if (isUp && index > 0) {
        // Move item up
        let temp = arr[index];
        arr[index] = arr[index - 1];
        arr[index - 1] = temp;
    } else if (!isUp && index < arr.length - 1) {
        // Move item down
        let temp = arr[index];
        arr[index] = arr[index + 1];
        arr[index + 1] = temp;
    }
    await saveInStorage('receptTypes', arr)
    setUpdate(true);
}

export function getIndex(array, bubble) {
    return array.findIndex(item => item.title === bubble);
}

export default function EditBubblePos({ arr, setUpdate, item }) {

    return (
        <View style={{ justifyContent: 'space-between', height: '16%', padding: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button mode='outlined' onPress={() => moveToStartEnd(arr, item, true, setUpdate)}>Erste Stelle</Button>
                <Button mode='outlined' onPress={() => moveUpDown(arr, item, true, setUpdate)}>Hoch</Button>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button mode='outlined' onPress={() => moveToStartEnd(arr, item, false, setUpdate)}>Letzte Stelle</Button>
                <Button mode='outlined' onPress={() => moveUpDown(arr, item, false, setUpdate)}>Runter</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

});

