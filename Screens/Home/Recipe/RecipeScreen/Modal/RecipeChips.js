import * as React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import AddChip from './AddChip';
import DeleteChip from './DeleteChip';
import { getArrayFromStorage, saveArrayStorage } from '../../../../modals/StorageService';


export let defaultTypes = ["Vorspeise", "Hauptspeise", "Aperitif", "Dessert", "Getränke"];
let defaultCategory = ["Gemüse", "Rind", "Huhn", "Fisch", "Obst"];
export let defaultCollection = ["Weihnachtsessen", "Geburtstag", "Festlich"];

function selectedDefault(title) {
    switch (title) {
        case 'types':
            return defaultTypes;
        case 'category':
            return defaultCategory;
        case 'collection':
            return defaultCollection;
        default:
            break;
    }
}

export default function RecipeChips({ title, handleDataChange, selectedChips }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedChip, setSelectedChip] = React.useState([]);
    const [chips, setChips] = React.useState(selectedDefault(title));
    const previousLength = React.useRef(chips.length);
    const selectedLength = React.useRef(selectedChip.length);
    const theme = useTheme();

    React.useEffect(() => {
        if (selectedChips && selectedChip !== selectedChips) {
            selectedChips.forEach(chip => {
                filterChips(chip);
            });
        }
    }, [selectedChips]);

    React.useEffect(() => {
        if (chips.length !== previousLength.current) {
            previousLength.current = chips.length;
            saveArrayStorage(title, chips);
        }
    }, [chips]);

    React.useEffect(() => {
        if (title === 'types') {
            handleDataChange('types', selectedChip);
        }
        if (title === 'category') {
            handleDataChange('category', selectedChip);
        }
        if (title === 'collection') {
            handleDataChange('collection', selectedChip);
        }

        if (selectedChip.length !== selectedLength.current) {
            selectedLength.current = selectedChip.length;
        }
    }, [selectedChip]);

    React.useEffect(() => {
        const loadTypes = async () => {
            const storedSections = await getArrayFromStorage(title);
            if (storedSections) {
                setChips(storedSections);
            } else {
                setChips(selectedDefault(title));
                saveArrayStorage(title, selectedDefault(title));
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

    const onPressChips = (type) => {
        if (title === 'types') {
            // Wenn der title 'types' ist
            if (selectedChip.includes(type)) {
                setSelectedChip([]);
            } else {
                setSelectedChip([type]);
            }
        } else {
            // Wenn der title etwas anderes ist
            if (selectedChip.includes(type)) {
                setSelectedChip(selectedChip.filter((item) => item !== type));
            } else {
                setSelectedChip([...selectedChip, type]);
            }
        }
    };


    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {chips.map((type, index) =>
                <TouchableWithoutFeedback
                    key={index}
                    onPress={() => onPressChips(type)}
                    onLongPress={() => { setSelectedChip([type]); setModalVisible(true); }}
                >
                    <View style={styles.chipContainer}>
                        <Chip
                            key={index}
                            mode='outlined'
                            selected={false}
                            textStyle={selectedChip.includes(type) ? { color: theme.chip.active.color } : 'black'}
                            style={[
                                styles.chip,
                                selectedChip.includes(type) ? { backgroundColor: theme.chip.active.bgColor } : { backgroundColor: theme.chip.passive }
                            ]}
                        >
                            {type}
                        </Chip>
                    </View>
                </TouchableWithoutFeedback>
            )}
            <AddChip
                setArray={setChips}
                variable={chips}
                title={title} />
            <DeleteChip
                setArray={setChips}
                variable={chips}
                selected={selectedChip}
                setModal={setModalVisible}
                variableModal={modalVisible} />
        </View>
    )

}

const styles = StyleSheet.create({
    chip: {
        padding: 4,
        borderRadius: 25,
        margin: 6,
        justifyContent: 'center'
    },
    chipActive: {
        color: 'white',
    }
})