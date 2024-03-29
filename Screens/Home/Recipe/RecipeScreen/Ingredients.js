import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { List, Checkbox, Dialog, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Switcher from './Modal/Switcher';
import { getArrayFromStorage, saveArrayStorage } from '../../../modals/StorageService';
import { useData } from '../../../modals/DataProvider';


let defaultSections = [
    {
        title: "Fleisch",
        items: [
            "Huhn",
            "Rind"
        ]
    },
    {
        title: "Fisch",
        items: [
            "Lachs",
            "Sardine"
        ]
    },
    {
        title: "Gemüse",
        items: [
            "Tomate",
            "Knoblauch"
        ]
    },

]

const saveSections = async (sections) => {
    try {
        await saveArrayStorage('sections', sections);
    } catch (error) {
        console.log(`Error saving sections: ${error}`);
    }
}

let ingredArray = [];
// export let sectionArray = [];

function addSection(sections, title) {
    sections.push({
        title: title,
        items: []
    });
    saveSections(sections);
}

function deleteItem(indexS, indexI, sections) {
    if (sectionTack) {
        sections.splice(indexS, 1);
    } else {
        sections[indexS].items.splice(indexI, 1);
    }
    saveSections(sections);
}

function addIngredient(title, index, sections) {
    sections[index].items.push(title);
    saveSections(sections);
}

function saveSectionArray(accordionTitle, setSectionArray) {
    const tempIngredArray = [...ingredArray];
    setSectionArray(sectionArray => [
        ...sectionArray,
        {
            title: setTitle ? accordionTitle : '-',
            ingredients: tempIngredArray,
        }
    ]);
    ingredArray = [];
    return
}

function saveInArray(selectedItem, value, unitSwitch) {
    if (selectedItem && value) {
        if (unitSwitch === 'EL' || unitSwitch === 'TL' || unitSwitch === 'Prise') {
            ingredArray.push(
                [value, ' ', unitSwitch, ' ', selectedItem]
            )
        } else {
            ingredArray.push(
                [value, unitSwitch, ' ', selectedItem]
            )
        }
    }
}

const IngredientList = ({ ingredients }) => {
    return (
        <View>
            {ingredients.map((ingredient, index) => (
                <Text key={index}>{ingredient}</Text>
            ))}
        </View>
    );
};

let sectionTack = false;
let setTitle = false;

export default function IngredientsScreen({ navigation }) {
    const [visibleDialogM, setVisibleDialogM] = React.useState(false);
    const [visibleDialogK, setVisibleDialogK] = React.useState(false);
    const [visibleDialogZ, setVisibleDialogZ] = React.useState(false);
    const [visibleDialog, setVisibleDialog] = React.useState(false);
    const [visibleDialogItem, setVisibleDialogItem] = React.useState(false);
    const [openAccordion, setOpenAccordion] = React.useState(-1);
    const [accordionTitle, setAccordionTitle] = React.useState('Abschnitt ...');
    const [itemArray, setItemArray] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [selectedItem, setSelectedItem] = React.useState('');
    const [sectionIndex, setSectionIndex] = React.useState('');
    const [ingredIndex, setIngredIndex] = React.useState('');
    const [sectionTitle, setSectionsTitle] = React.useState('');
    const [sectionArray, setSectionArray] = React.useState([]);
    const [sections, setSections] = React.useState(defaultSections);
    const [unitSwitch, setUnitSwitch] = React.useState('g');
    const theme = useTheme();
    const { data, updateData } = useData();


    React.useEffect(() => {
        const loadSections = async () => {
            const storedSections = await getArrayFromStorage('sections');
            if (storedSections) {
                setSections(storedSections);
            } else {
                setSections(defaultSections);
                saveSections(defaultSections);
            };
        };
        loadSections();

    }, []);

    const handleDataChange = (dataValue, newValue) => {
        if (newValue) {
            // console.log(dataValue, newValue)
            // Erstelle ein neues Objekt, das eine Kopie der aktuellen Daten enthält
            const updatedData = { ...data };
            // Aktualisiere das Objekt mit dem neuen Wert für den angegebenen Schlüssel (dataValue)
            updatedData[dataValue] = newValue;
            // Aktualisiere die Daten im Kontext mit dem aktualisierten Objekt
            updateData(updatedData);
        }
    };

    React.useEffect(() => {
        if (data.isFetched) {
            setSectionArray(data.recipeArray)
        }
    }, [data.isFetched])

    React.useEffect(() => {
        handleDataChange('recipeArray', sectionArray);
    }, [sectionArray]);

    return (

        <View style={{ height: '100%' }}>
            <View style={styles.container}>

                <View style={styles.ingredContainer}>
                    <ScrollView style={{ marginBottom: 60 }}>
                        <List.Section >
                            <List.Accordion
                                expanded={true}
                                onPress={() => setVisibleDialog(true)}
                                title={accordionTitle}
                            >
                                {sections.map((section, i) =>
                                    <List.Accordion
                                        key={i}
                                        expanded={openAccordion === i}
                                        onPress={() => openAccordion === i ? setOpenAccordion() : setOpenAccordion(i)}
                                        onLongPress={() => {
                                            sectionTack = true;
                                            setSectionIndex(i);
                                            setSelectedItem(section.title);
                                            setSectionsTitle(section.title)
                                            setVisibleDialogM(true)
                                        }}
                                        style={styles.pLeft}
                                        title={section.title}
                                        left={props => <List.Icon {...props}
                                        />}>
                                        {section.items.map((item, index) =>
                                            <List.Item
                                                key={index}
                                                title={item}
                                                onLongPress={() => {
                                                    setSectionsTitle(section);
                                                    setSectionIndex(i);
                                                    setIngredIndex(index);
                                                    setSelectedItem(item);
                                                    setVisibleDialogM(true)
                                                }}
                                                onPress={() => {
                                                    setItemArray(true);
                                                    setSectionIndex(i);
                                                    setIngredIndex(index);
                                                    setSelectedItem(item);
                                                    setInputValue('');
                                                    setVisibleDialogItem(true)
                                                }}
                                                left={() => (
                                                    <Checkbox
                                                        status={ingredArray.some(ingredientArray => ingredientArray.includes(item)) ? 'checked' : 'unchecked'}
                                                    />
                                                )} />
                                        )}
                                        <List.Item
                                            style={{}}
                                            // titleStyle={{ textAlign: 'center' }}
                                            title='Zutat hinzufügen'
                                            onPress={() => { setInputValue(''); setSectionsTitle(section); setSectionIndex(i); setVisibleDialogZ(true); }}
                                            sectionIndex={i}
                                        />
                                    </List.Accordion>
                                )}
                                <List.Item
                                    style={{ backgroundColor: 'white' }}
                                    titleStyle={{ textAlign: 'center' }}
                                    title='hinzufügen'
                                    onPress={() => { setInputValue(''); setVisibleDialogK(true) }}
                                />
                            </List.Accordion>
                        </List.Section>

                    </ScrollView>
                </View>

                <View style={{ width: '40%', marginTop: 8, marginLeft: 4 }}>
                    <View>
                        <Text>{accordionTitle}</Text>
                        <IngredientList ingredients={ingredArray} />
                    </View>

                    <View style={{ marginTop: 0 }}>
                        <ScrollView>
                            {sectionArray?.map((item, index) =>
                                <View style={{ marginTop: 16, marginRight: 8, marginLeft: 4, padding: 4, borderWidth: 2, borderColor: 'black' }} key={index}>
                                    <Text style={{ textAlign: 'center' }}>{item.title} </Text>
                                    {item.ingredients.map((item, index) =>
                                        <Text key={index}>- {item}</Text>
                                    )}
                                    <TouchableOpacity style={{ alignItems: 'center' }}
                                        onPress={() => setSectionArray([...sectionArray.slice(0, index), ...sectionArray.slice(index + 1)])}>
                                        <Icon name="close-circle-outline" size={20} color="black" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                </View>



            </View >



            <TouchableOpacity
                // disabled={ingredArray.length <= 0 && accordionTitle === 'Abschnitt ...' ? true : false}
                style={[styles.button, { backgroundColor: theme.button2, position: 'absolute', bottom: 8, left: 8, right: 8 }]}
                onPress={() => {
                    if (ingredArray.length == 0) { alert('Du hast keine Zutaten ausgewählt.') }
                    else { saveSectionArray(accordionTitle, setSectionArray); setVisibleDialog(false); setAccordionTitle('Abschnitt ...'), setTitle = false, setItemArray(false) }
                }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Auswahl speichern</Text>
                {/* <Icon name="chevron-back-outline" size={20} color="#fff" /> */}
            </TouchableOpacity>

            {/* Dialog um eine Meldung anzuzeigen ##################################################################### */}
            <Dialog visible={visibleDialogM} onDismiss={() => setVisibleDialogM(false)}>
                <Dialog.Content>
                    <Text style={{ fontSize: 22 }}>Bist du sicher, dass "{selectedItem}" gelöscht werden soll?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => { deleteItem(sectionIndex, ingredIndex, sections); sectionTack = false; setVisibleDialogM(false) }}>Löschen</Button>
                    <Button onPress={() => { sectionTack = false; setVisibleDialogM(false) }}>Abbrechen</Button>
                </Dialog.Actions>
            </Dialog>

            {/* Dialog um eine Kategorie hinzuzufügen ##################################################################### */}
            <Dialog visible={visibleDialogK} onDismiss={() => setVisibleDialogK(false)}>
                <Dialog.Title>Benenne deine Kategorie</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        autoFocus={visibleDialogK}
                        placeholder='Kategorie ...'
                        onChangeText={text => setInputValue(text)}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        disabled={inputValue.length > 0 ? false : true}
                        onPress={() => { addSection(sections, inputValue), setVisibleDialogK(false); }}>Speichern</Button>
                    <Button onPress={() => { setInputValue(''); setVisibleDialogK(false) }}>Abbrechen</Button>
                </Dialog.Actions>
            </Dialog>

            {/* Dialog für Zutat hinzufügen ##################################################################### */}
            <Dialog visible={visibleDialogZ} onDismiss={() => setVisibleDialogZ(false)}>
                <Dialog.Title>Wähle deine Zutat</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        autoFocus={visibleDialogZ}
                        placeholder='Zutat ...'
                        onChangeText={text => setInputValue(text)}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        disabled={inputValue.length > 0 ? false : true}
                        onPress={() => {
                            addIngredient(inputValue, sectionIndex, sections);
                            //  addItemToTable(sectionTitle, inputValue); 
                            setVisibleDialogZ(false);
                        }}>Speichern</Button>
                    <Button onPress={() => setVisibleDialogZ(false)}>Abbrechen</Button>
                </Dialog.Actions>
            </Dialog>

            {/* Dialog um den Titel des Abschnitts zu bestimmen #####################################################*/}
            <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
                <Dialog.Title>Wähle den Titel</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        autoFocus={visibleDialog}
                        placeholder='Abschnitt ...'
                        onChangeText={text => { setAccordionTitle(text), setTitle = true }}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setVisibleDialog(false)}>Schließen</Button>
                </Dialog.Actions>
            </Dialog>

            {/* Dialog um die Menge der Zutat zu bestimmen */}
            <Dialog visible={visibleDialogItem} onDismiss={() => { setVisibleDialogItem(false) }}>
                <Dialog.Title>Wähle die Menge von {selectedItem}</Dialog.Title>
                <Dialog.Content>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            style={{ flex: 1 }}
                            autoFocus={visibleDialogItem}
                            placeholder='Menge...'
                            maxLength={10}
                            onChangeText={text => setInputValue(text)}
                            keyboardType='number-pad'
                        />
                        <Switcher title={unitSwitch} setSwitch={setUnitSwitch} prop={'units'} />
                    </View>

                </Dialog.Content>
                <Dialog.Actions style={{ zIndex: 0 }}>
                    <Button disabled={inputValue.length > 0 ? false : true}
                        onPress={() => { saveInArray(selectedItem, inputValue, unitSwitch), setVisibleDialogItem(false); }}>Speichern</Button>
                    {/* <Button >Entfernen</Button> */}
                    <Button onPress={() => { ; setVisibleDialogItem(false); setInputValue('') }}>Abbrechen</Button>


                </Dialog.Actions>
            </Dialog>
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
    },
    ingredContainer: {
        width: '60%',
    },
    pLeft: {
        marginLeft: 32,

    },
    button: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
    },
    buttonCon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})