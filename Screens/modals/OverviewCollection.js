import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Chip } from 'react-native-paper';
import AddChip from './addChip';
import DeleteChip from './DeleteChip';
import { saveInStorage, getStorage } from '../ReceptScreen/Overview';

export let defaultCategory = ["Weihnachtsessen", "Geburtstag", "Festlich"];


export default function CollectionChips({ selectedChipCol }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedChips, setSelectedChips] = React.useState([]);
    const [category, setCategory] = React.useState(defaultCategory);
    const title = 'Sammlung';

    const previousLength = React.useRef(category.length);
    const selectedLength = React.useRef(selectedChips.length);

    React.useEffect(() => {
        if (selectedChipCol && selectedChips !== selectedChipCol) {
            selectedChipCol.forEach(chip => {
                filterChips(chip);
            });
        }
    }, [selectedChipCol?.length]);

    React.useEffect(() => {
        if (category.length !== previousLength.current) {
            previousLength.current = category.length;
            saveInStorage(title, category);
        }
    }, [category]);

    React.useEffect(() => {
        if (selectedChips.length !== selectedLength.current) {
            selectedLength.current = selectedChips.length;
            saveInStorage('selectedSammlung', selectedChips);
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
                    style={[styles.chip, selectedChips.includes(type) ? { backgroundColor: '#9a998c' } : { backgroundColor: '#e1e1e1' }]}
                    textStyle={selectedChips.includes(type) ? styles.chipActive : {}}
                    selected={false}
                    onLongPress={() => { setSelectedChips([type]), setModalVisible(true) }}
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