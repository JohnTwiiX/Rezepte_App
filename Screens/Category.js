import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


export default function CategoryScreen({ route }) {
    const navigation = useNavigation();
    // const routeParams = navigation.getParam('title');


    return (
        <ScrollView>
            <View style={{}}>
                <Text>Hallo hier bei </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8
    },
    button: {
        // position: 'absolute',
        // top: 16,
        // left: 16,
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
    chipContainer: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    input: {
        marginTop: 8,
        marginBottom: 8
    }
});