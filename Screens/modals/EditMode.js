import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { Dialog, Button } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultCollection, defaultTypes } from './ReceptChips';
import { useData } from './DataProvider';
import Icon from 'react-native-vector-icons/Ionicons';


export default function EditMode({ }) {
    const [visible, setVisible] = React.useState(false);
    const { data, updateData } = useData();


    const handleDataChange = () => {
        if (data.isEditMode) {
            const updatedData = { ...data };
            updatedData['isEditMode'] = false;
            updateData(updatedData);
        } else {
            const updatedData = { ...data };
            updatedData['isEditMode'] = true;
            updateData(updatedData);
        }
    };
    return (
        <View>
            <Icon name={'pencil'} size={20} onPress={handleDataChange} />
        </View>
    );
}

const styles = StyleSheet.create({

});

