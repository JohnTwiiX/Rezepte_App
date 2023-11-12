import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Dialog, Divider, Menu } from 'react-native-paper';
import { setDialogVisible } from '../Category';




export default function CategoryFilter({ openDialog }) {
    return (
        <View>
            <Icon name="filter-outline" size={25} onPress={openDialog} />
        </View>
    );
}

// const styles = StyleSheet.create({
//     menuItem: {
//         display: 'flex',
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
// })
