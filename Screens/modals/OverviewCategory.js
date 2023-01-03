import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Chip } from 'react-native-paper';
import AddChip from './addChip';


let category = ["Gemüse", "Rind", "Huhn", "Fisch", "Obst"];

export default function CategoryChips() {
    const [selectedChips, setSelectedChips] = React.useState([]);
    const title = 'Kategorie';


    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {category.map((type, index) =>
                <Chip
                    key={index}
                    mode="outlined"
                    style={[{ width: 'auto', height: 50, borderRadius: 25, margin: 6 }, selectedChips.includes(type) ? { backgroundColor: '#64ffda' } : { backgroundColor: 'rgb(232,225,237)' }]}
                    selected={false}
                    onPress={() => {
                        if (selectedChips.includes(type)) {
                            setSelectedChips(selectedChips.filter((item) => item !== type));
                        } else {
                            setSelectedChips([...selectedChips, type]);
                        }
                    }}
                >
                    {type}
                </Chip>
            )}
            <AddChip array={category} title={title} />
        </View>
    )

}