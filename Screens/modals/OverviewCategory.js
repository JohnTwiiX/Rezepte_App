import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Chip, useTheme } from 'react-native-paper';
import AddChip from './AddChip';
import DeleteChip from './DeleteChip';
import { saveInStorage, getStorage } from '../ReceptScreen/Overview';
import { fetchData } from '../ReceptScreen/Overview';

let defaultCategory = ["Gemüse", "Rind", "Huhn", "Fisch", "Obst"];



export default function CategoryChips({ handleDataChange, selectedChipCat }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedChips, setSelectedChips] = React.useState([]);
    const [category, setCategory] = React.useState(defaultCategory)
    const title = 'Kategorie';

    const previousLength = React.useRef(category.length);
    const selectedLength = React.useRef(selectedChips.length);
    const theme = useTheme();

    React.useEffect(() => {
        if (selectedChipCat && selectedChips !== selectedChipCat) {
            selectedChipCat.forEach(chip => {
                filterChips(chip);
            });
        }
    }, [selectedChipCat?.length]);

    React.useEffect(() => {
        if (category.length !== previousLength.current) {
            previousLength.current = category.length;
            saveInStorage(title, category);
        }
    }, [category]);

    React.useEffect(() => {
        if (selectedChips.length !== selectedLength.current) {
            selectedLength.current = selectedChips.length;
            handleDataChange('chipsCategory', selectedChips);
        }
    }, [selectedChips]);

    React.useEffect(() => {
        const loadCategory = async () => {
            const storedSections = await getStorage(title);
            if (storedSections) {
                setCategory(storedSections);
            } else {
                setCategory(defaultCategory);
                saveInStorage(title, defaultCategory);
            }
        }
        loadCategory();
    }, []);

    function filterChips(type) {
        setSelectedChips(prevSelectedChips => {
            if (prevSelectedChips.includes(type)) {
                return prevSelectedChips.filter(item => item !== type);
            } else {
                return [...prevSelectedChips, type];
            }
        });
    }


    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {category.map((type, index) =>
                <Chip
                    key={index}
                    mode="outlined"
                    textStyle={selectedChips.includes(type) ? { color: theme.colors.chip.active.color } : 'black'}
                    style={[styles.chip, selectedChips.includes(type) ? { backgroundColor: theme.colors.chip.active.bgColor } : { backgroundColor: theme.colors.chip.passive }]}
                    onLongPress={() => { setSelectedChips([type]), setModalVisible(true) }}
                    selected={false}
                    onPress={() => {
                        filterChips(type);
                    }}
                >
                    {type}
                </Chip>
            )}
            <AddChip
                setArray={setCategory}
                variable={category}
                title={title} />
            <DeleteChip
                setArray={setCategory}
                variable={category}
                selected={selectedChips}
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