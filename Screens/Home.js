import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CircleButtons from './modals/Bubbles';
import { setFetchedReceptCompleted } from './ReceptScreen/Overview';
import { saveAll } from './ReceptScreen/Preparation';
import { setSectionArrayEmpty } from './ReceptScreen/Ingredients';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
    useFocusEffect(
        React.useCallback(() => {
            setFetchedReceptCompleted();
            saveAll();
        }, []),);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AddRecept')}>
                <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>

            <View>
                <CircleButtons />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        position: 'absolute',
        top: 16,
        right: 16,
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 100,
        zIndex: 2
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
});
