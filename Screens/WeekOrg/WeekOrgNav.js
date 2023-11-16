import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WeekOrgScreen from './WeekOrgScreen';
import CalendarScreen from './CalendarScreen';
import { Text, Button } from 'react-native-paper';

export default function WeekOrgNav({ navigation }) {
    const [currentScreen, setCurrentScreen] = useState('WeekOrgScreen');

    const switchToWeekOrgScreen = () => {
        setCurrentScreen('WeekOrgScreen');
    };

    const switchToCalendarScreen = () => {
        setCurrentScreen('CalendarScreen');
    };

    return (
        <View style={{ flex: 1 }}>
            <Text variant="displaySmall" style={styles.title}>Wochen Planer</Text>
            {/* Ihre Tab-Leiste mit dem Wechsel-Button */}
            <View style={styles.buttonBar}>
                {currentScreen === 'CalendarScreen' && <Button onPress={switchToWeekOrgScreen}>zur Wochenansicht</Button>}
                {currentScreen === 'WeekOrgScreen' && <Button onPress={switchToCalendarScreen}>zur Kalenderansicht</Button>}
            </View>
            {currentScreen === 'WeekOrgScreen' && <WeekOrgScreen navigation={navigation} />}
            {currentScreen === 'CalendarScreen' && <CalendarScreen navigation={navigation} />}
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        textDecorationLine: 'underline',
        textDecorationStyle: 'double',
        marginBottom: 8
    },
    buttonBar: {
        flexDirection: 'row',
    }
})