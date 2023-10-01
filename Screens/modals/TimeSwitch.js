import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { List } from 'react-native-paper';


export default function TimeSwitch({ route }) {
    const [expanded, setExpanded] = React.useState(false);
    const children = ['min', 'h']

    function toggleItem() {
        setExpanded(!expanded);
    }

    return (
        <View>
            <TouchableOpacity onPress={toggleItem}>
                <Text>min</Text>
            </TouchableOpacity>
            {expanded &&
                <View>
                    {children.map((item, index) => <Text>{item}</Text>)}
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({

});