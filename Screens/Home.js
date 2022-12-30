import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Home screen</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AddRecept')}>
                <Icon name="add" size={20} color="#fff" />
                {/* <Text style={styles.buttonText}>Add Recipe</Text> */}
            </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
});
