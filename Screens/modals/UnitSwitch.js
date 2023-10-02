import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { Divider, List, useTheme } from 'react-native-paper';


export default function UnitSwitch({ title, setUnitSwitch }) {
    const [expanded, setExpanded] = React.useState(false);
    const children = ['mg', 'g', 'kg', 'ml', 'l', 'TL', 'EL', 'Prise']
    const theme = useTheme();

    function toggleItem() {
        setExpanded(!expanded);
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.color }]}>
            {!expanded &&
                <TouchableOpacity onPress={toggleItem}>
                    <Text style={{ fontSize: 18 }}>{title}</Text>
                </TouchableOpacity>}
            {expanded &&
                <View style={{ alignItems: 'center', justifyContent: 'space-around', width: '100%' }} >
                    {children.map((item, index) =>
                        <TouchableOpacity key={index} onPress={() => { setUnitSwitch(item); toggleItem() }} style={{ width: '100%', alignItems: 'center', margin: 8 }}>
                            <Text style={{ fontSize: 18 }}>{item}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            }
        </View >
    );
}

export const styles = StyleSheet.create({
    container: {
        // height: 56,
        width: 45,
        marginTop: 8,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black'
    }
});