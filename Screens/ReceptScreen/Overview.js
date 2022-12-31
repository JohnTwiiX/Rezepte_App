import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Select } from 'react-native-paper';

export default function Overview({ navigation }) {
    const [text, setText] = React.useState("");
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}>
                <Icon name="chevron-back-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TextInput
                label="Title"
                value={text}
                onChangeText={text => setText(text)}
            />
            <TextInput
                label="Rezeptart"
                value={text}
                onChangeText={text => setText(text)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    button: {
        position: 'absolute',
        top: 16,
        left: 16,
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 100,

    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
});