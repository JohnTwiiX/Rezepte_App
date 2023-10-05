import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import AddChip from './AddChip';
import DeleteChip from './DeleteChip';
import { saveInStorage, getStorage } from '../ReceptScreen/Overview';


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

export default function ReceptChips({ title, handleDataChange, selectedChips }) {
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
    }, [selectedChips?.length]);

    React.useEffect(() => {
        if (chips.length !== previousLength.current) {
            previousLength.current = chips.length;
            saveInStorage(title, chips);
        }
    }, [chips]);

    React.useEffect(() => {
        if (title === 'types') {
            handleDataChange('chipType', selectedChip);
        }
        if (title === 'category') {
            handleDataChange('chipsCategory', selectedChip);
        }
        if (title === 'collection') {
            handleDataChange('chipsCollection', selectedChip);
        }

        if (selectedChip.length !== selectedLength.current) {
            selectedLength.current = selectedChip.length;
        }
    }, [selectedChip]);

    React.useEffect(() => {
        const loadTypes = async () => {
            const storedSections = await getStorage(title);
            if (storedSections) {
                setChips(storedSections);
            } else {
                setChips(selectedDefault(title));
                saveInStorage(title, selectedDefault(title));
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
                <Chip
                    key={index}
                    mode='outlined'
                    selected={false}
                    textStyle={selectedChip.includes(type) ? { color: theme.colors.chip.active.color } : 'black'}
                    style={[styles.chip, selectedChip.includes(type) ? { backgroundColor: theme.colors.chip.active.bgColor } : { backgroundColor: theme.colors.chip.passive }]}
                    onLongPress={() => { setSelectedChip([type]), setModalVisible(true) }}
                    onPress={() => onPressChips(type)}
                >
                    {type}
                </Chip>
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
        width: 'auto',
        height: 50,
        borderRadius: 25,
        margin: 6
    },
    chipActive: {
        color: 'white',
    }
})