import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';


export default function InvisibleButton() {
    const [clickCount, setClickCount] = React.useState(0);
    const navigation = useNavigation()

    const handleClick = () => {
        setClickCount(prevCount => prevCount + 1);
        setTimeout(() => {
            setClickCount(0);
        }, 3000);
        if (clickCount >= 14) {
            navigation.navigate('Login');
        }
    };

    return (
        <TouchableWithoutFeedback touchSoundDisabled onPress={handleClick}>
            <View style={styles.button}></View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        width: 50,
    }
})