import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Chip } from 'react-native-paper';
import AddChip from './addChip';




export default function ReceptTypeChips() {
    const [selectedChip, setSelectedChip] = React.useState([]);
    let receptTypes = ["Vorspeise", "Hauptspeise", "Aperitif", "Dessert", "Getränke"];
    const title = 'Rezeptart';
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {receptTypes.map((type, index) =>
                <Chip
                    key={index}
                    mode='outlined'
                    selected={false}
                    style={[{ width: 'auto', height: 50, borderRadius: 25, margin: 6 }, selectedChip.includes(type) ? { backgroundColor: '#64ffda' } : { backgroundColor: 'rgb(232,225,237)' }]}
                    onPress={() => {
                        if (selectedChip.includes(type)) {
                            setSelectedChip([]);
                        } else {
                            setSelectedChip([type]);
                        }
                    }}
                >
                    {type}
                </Chip>
            )}
            <AddChip array={receptTypes} title={title} />
        </View>
    )

}

;