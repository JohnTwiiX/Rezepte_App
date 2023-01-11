import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { List, Checkbox, Dialog, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        const sectionsString = JSON.stringify(sections);
        await AsyncStorage.setItem('sections', sectionsString);
    } catch (error) {
        console.log(`Error saving sections: ${error}`);
    }
}

const getSections = async () => {
    try {
        const sectionsString = await AsyncStorage.getItem('sections');
        if (sectionsString != null) {
            return JSON.parse(sectionsString);
        }
        return null;
    } catch (error) {
        console.log(`Error retrieving sections: ${error}`);
    }
}


let ingredArray = [];
export let sectionArray = [];

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

function saveSectonArray(accordionTitle) {
    const tempIngredArray = [...ingredArray];
    sectionArray.push({
        title: setTitle ? accordionTitle : '',
        ingredients: tempIngredArray,
    });
    ingredArray = [];
    return
}

function saveInArray(selectedItem, itemTitle) {
    if (selectedItem && itemTitle) {
        ingredArray.push(
            [itemTitle, ' ', selectedItem]
        )
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



    const [sections, setSections] = React.useState(defaultSections);

    React.useEffect(() => {
        const loadSections = async () => {
            const storedSections = await getSections();
            if (storedSections) {
                setSections(storedSections);
            } else {
                setSections(defaultSections);
                saveSections(defaultSections);
            }
        }
        loadSections();
    }, []);

    return (
        <View style={styles.container}>

            <View style={styles.ingredContainer}>
                <ScrollView>
                    <List.Section >
                        <List.Accordion
                            expanded={true}
                            onPress={() => setVisibleDialog(true)}
                            title={accordionTitle}
                        // left={}
                        >
                            {sections.map((section, i) =>
                                <List.Accordion
                                    key={i}
                                    expanded={openAccordion === i}
                                    onPress={() => setOpenAccordion(i)}
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
                                                    status='unchecked'
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
                    <TouchableOpacity
                        // disabled={ingredArray.length <= 0 && accordionTitle === 'Abschnitt ...' ? true : false}
                        style={styles.button}
                        onPress={() => {
                            if (ingredArray.length == 0) { alert('Du hast keine Zutaten ausgewählt.') }
                            else { saveSectonArray(accordionTitle); setVisibleDialog(false); setAccordionTitle('Abschnitt ...'), setTitle = false, setItemArray(false) }
                        }}>
                        <Text style={{ color: 'white' }}>Auswahl speichern</Text>
                        {/* <Icon name="chevron-back-outline" size={20} color="#fff" /> */}
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={{ width: '100%' }}>
                {/* {console.log('---- S ', sectionIndex, '--- I ', ingredIndex)} */}
                <View>
                    <Text>{accordionTitle}</Text>
                    <IngredientList ingredients={ingredArray} />
                </View>

                <View style={{ marginTop: 24 }}>
                    <ScrollView>
                        {sectionArray.map((item, index) =>
                            <View style={{ marginTop: 16, borderBottomWidth: 1, borderBottomColor: 'black' }} key={index}>
                                <Text>{item.title} </Text>
                                {item.ingredients.map((item, index) =>
                                    <Text key={index}>{item}</Text>
                                )}
                            </View>

                        )}
                    </ScrollView>
                </View>

            </View>
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
                    <Button onPress={() => setVisibleDialogZ(false)}>Done</Button>
                </Dialog.Actions>
            </Dialog>

            {/* Dialog um den Titel des Abschnitts zu bestimmen #####################################################*/}
            <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
                <Dialog.Title>Wähle den Titel</Dialog.Title>
                <Dialog.Content>
                    <TextInput
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
                    <TextInput
                        placeholder='Menge ...'
                        maxLength={10}
                        onChangeText={text => setInputValue(text)}
                    />
                </Dialog.Content>
                <Dialog.Actions >
                    <Button disabled={inputValue.length > 0 ? false : true}
                        onPress={() => { saveInArray(selectedItem, inputValue), setVisibleDialogItem(false); }}>Speichern</Button>
                    {/* <Button >Entfernen</Button> */}
                    <Button onPress={() => { ; setVisibleDialogItem(false); setInputValue('') }}>Abbrechen</Button>


                </Dialog.Actions>
            </Dialog>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        height: '100%'
    },
    ingredContainer: {
        width: '60%',
        // backgroundColor: 'green'
    },
    pLeft: {
        marginLeft: 32,

    },
    button: {
        // position: 'absolute',
        // bottom: 16,
        // left: 16,
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 100,

    },
})