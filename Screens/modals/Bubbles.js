import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

function CircleButton({ size, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}>
            {/* Hier könnten Sie den Button-Inhalt platzieren, wie zum Beispiel ein Icon oder Text */}
        </TouchableOpacity>
    );
}

export default function CircleButtons() {
    return (
        <View style={styles.container}>
            <CircleButton size={160} onPress={() => console.log('Button 1 gedrückt')} />
            <CircleButton size={200} onPress={() => console.log('Button 2 gedrückt')} />
            <CircleButton size={130} onPress={() => console.log('Button 3 gedrückt')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#0066cc',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

