import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { List, Modal, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Octicons';


export default function Switcher({ title, setSwitch, prop }) {
    const [expanded, setExpanded] = React.useState(false);
    const times = ['min', 'h'];
    const potionPerson = ['Pers', 'Portion'];
    const units = ['mg', 'g', 'kg', 'ml', 'l', 'TL', 'EL', 'Prise'];
    const theme = useTheme();

    function toggleItem() {
        setExpanded(!expanded);
    }

    return (
        <View >
            {!expanded &&
                <View style={[styles.container, { backgroundColor: theme.colors.color }]}>
                    <Icon name='triangle-down' size={18} onPress={toggleItem} color='rgba(0, 0, 0, 0.3)' />
                    <Text>{title}</Text>
                </View>
            }
            {expanded && (prop === 'work' || prop === 'cook') &&
                <View style={styles.switch} >
                    <Icon name='triangle-up' size={18} onPress={toggleItem} color='rgba(0, 0, 0, 0.3)' />
                    {times.map((item, index) =>
                        <TouchableOpacity key={index} onPress={() => { setSwitch(item); toggleItem() }} style={styles.switchItem}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            }
            {expanded && prop === 'potion' &&
                <View style={styles.switch} >
                    <Icon name='triangle-up' size={18} onPress={toggleItem} color='rgba(0, 0, 0, 0.3)' />
                    {potionPerson.map((item, index) =>
                        <TouchableOpacity key={index} onPress={() => { setSwitch(item); toggleItem() }} style={styles.switchItem}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            }
            {expanded && prop === 'units' &&
                <View style={styles.switch} >
                    <Icon name='triangle-up' size={18} onPress={toggleItem} color='rgba(0, 0, 0, 0.3)' />
                    {units.map((item, index) =>
                        <TouchableOpacity key={index} onPress={() => { setSwitch(item); toggleItem() }} style={styles.switchItem}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            }

        </View >
    );
}

export const styles = StyleSheet.create({
    container: {
        height: 56,
        width: 50,
        marginTop: 8,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 4,
        borderBottomColor: 'rgba(0, 0, 0, 0.25)',
        borderBottomWidth: 1.5
    },
    switch: {
        alignItems: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 50,
        backgroundColor: 'white',
    },
    switchItem: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        margin: 4
    }
});