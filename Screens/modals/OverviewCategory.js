import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Chip } from 'react-native-paper';
import AddChip from './addChip';
import DeleteChip from './DeleteChip';
import { saveInStorage, getStorage } from '../ReceptScreen/Overview';

let defaultCategory = ["Gemüse", "Rind", "Huhn", "Fisch", "Obst"];



export default function CategoryChips() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedChips, setSelectedChips] = React.useState([]);
    const [category, setCategory] = React.useState(defaultCategory)
    const title = 'Kategorie';

    const previousLength = React.useRef(category.length);
    const selectedLength = React.useRef(selectedChips.length);

    React.useEffect(() => {
        if (category.length !== previousLength.current) {
            previousLength.current = category.length;
            saveInStorage(title, category);
        }
    }, [category]);

    React.useEffect(() => {
        if (selectedChips.length !== selectedLength.current) {
            selectedLength.current = selectedChips.length;
            saveInStorage('selectedKategorie', selectedChips);
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


    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {category.map((type, index) =>
                <Chip
                    key={index}
                    mode="outlined"
                    style={[{ width: 'auto', height: 50, borderRadius: 25, margin: 6 }, selectedChips.includes(type) ? { backgroundColor: '#64ffda' } : { backgroundColor: 'rgb(232,225,237)' }]}
                    onLongPress={() => { setSelectedChips([type]), setModalVisible(true) }}
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