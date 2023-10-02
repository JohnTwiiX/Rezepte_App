import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { List, useTheme } from 'react-native-paper';


export default function TimeSwitch({ title, setTimeSwitch }) {
    const [expanded, setExpanded] = React.useState(false);
    const children = ['min', 'h']
    const theme = useTheme();

    function toggleItem() {
        setExpanded(!expanded);
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.color }]}>
            {!expanded &&
                <TouchableOpacity onPress={toggleItem}>
                    <Text>{title}</Text>
                </TouchableOpacity>}
            {expanded &&
                <View style={{ alignItems: 'center', justifyContent: 'space-around', height: 60, width: '100%' }} >
                    {children.map((item, index) =>
                        <TouchableOpacity key={index} onPress={() => { setTimeSwitch(item); toggleItem() }} style={{ width: '100%', alignItems: 'center' }}>
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
        width: 34,
        marginTop: 8,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 4,
        borderBottomColor: 'black',
        borderBottomWidth: 0.7
    }
});