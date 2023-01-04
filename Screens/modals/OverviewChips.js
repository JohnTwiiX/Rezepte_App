import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Chip } from 'react-native-paper';
import AddChip from './addChip';
import DeleteChip from './DeleteChip';




export default function ReceptTypeChips() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedChip, setSelectedChip] = React.useState([]);
    const [receptTypes, setreceptTypes] = React.useState(["Vorspeise", "Hauptspeise", "Aperitif", "Dessert", "Getränke"]);
    const title = 'Rezeptart';
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {receptTypes.map((type, index) =>
                <Chip
                    key={index}
                    mode='outlined'
                    selected={false}
                    style={[{ width: 'auto', height: 50, borderRadius: 25, margin: 6 }, selectedChip.includes(type) ? { backgroundColor: '#64ffda' } : { backgroundColor: 'rgb(232,225,237)' }]}
                    onLongPress={() => { setSelectedChip(type), setModalVisible(true) }}
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
            <AddChip setArray={setreceptTypes} variable={receptTypes} title={title} />
            <DeleteChip setArray={setreceptTypes} variable={receptTypes} selected={selectedChip} setModal={setModalVisible} variableModal={modalVisible} />
        </View>
    )

}

;