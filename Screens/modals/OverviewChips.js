import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Chip } from 'react-native-paper';



export default function ReceptTypeChips() {
    const [selectedChip, setSelectedChip] = React.useState([]);
    const receptTypes = ["Vorspeise", "Hauptspeise", "Aperitif", "Dessert", "Getränke"];
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {receptTypes.map((type, index) =>
                <Chip
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
        </View>
    )

}

;