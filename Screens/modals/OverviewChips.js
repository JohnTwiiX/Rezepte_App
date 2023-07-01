import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Chip } from 'react-native-paper';
import AddChip from './addChip';
import DeleteChip from './DeleteChip';
import { saveInStorage, getStorage } from '../ReceptScreen/Overview';


export let defaultTypes = ["Vorspeise", "Hauptspeise", "Aperitif", "Dessert", "Getränke"];


export default function ReceptTypeChips({ selectedChipType }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedChip, setSelectedChip] = React.useState([]);
    const [receptTypes, setreceptTypes] = React.useState(defaultTypes);
    const title = 'Rezeptart';
    const previousLength = React.useRef(receptTypes.length);
    const selectedLength = React.useRef(selectedChip.length);

    React.useEffect(() => {
        if (selectedChipType && selectedChip !== selectedChipType) {
            selectedChipType.forEach(chip => {
                filterChips(chip);
            });
        }
    }, [selectedChipType?.length]);

    React.useEffect(() => {
        if (receptTypes.length !== previousLength.current) {
            previousLength.current = receptTypes.length;
            saveInStorage(title, receptTypes);
        }
    }, [receptTypes]);

    React.useEffect(() => {
        if (selectedChip.length !== selectedLength.current) {
            selectedLength.current = selectedChip.length;
            saveInStorage('selectedRezeptart', selectedChip);
        }
    }, [selectedChip]);

    React.useEffect(() => {
        const loadTypes = async () => {
            const storedSections = await getStorage(title);
            if (storedSections) {
                setreceptTypes(storedSections);
            } else {
                setreceptTypes(defaultTypes);
                saveInStorage(title, defaultTypes);
            }
        }
        loadTypes();
    }, []);

    function filterChips(type) {
        setSelectedChip(prevSelectedChip => {
            if (prevSelectedChip.includes(type)) {
                return prevSelectedChip.filter(item => item !== type);
            } else {
                return [...prevSelectedChip, type];
            }
        });
    }


    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {receptTypes.map((type, index) =>
                <Chip
                    key={index}
                    mode='outlined'
                    selected={false}
                    style={[{ width: 'auto', height: 50, borderRadius: 25, margin: 6 }, selectedChip.includes(type) ? { backgroundColor: '#64ffda' } : { backgroundColor: 'rgb(232,225,237)' }]}
                    onLongPress={() => { setSelectedChip([type]), setModalVisible(true) }}
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
            <AddChip
                setArray={setreceptTypes}
                variable={receptTypes}
                title={title} />
            <DeleteChip
                setArray={setreceptTypes}
                variable={receptTypes}
                selected={selectedChip}
                setModal={setModalVisible}
                variableModal={modalVisible} />
        </View>
    )

}

;