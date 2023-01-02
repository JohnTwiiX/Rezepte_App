import * as React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { List, Checkbox, Dialog, Paragraph, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';


const sections = [
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

const ingredArray = [];
const sectionArray = [];

function saveSectonArray(accordionTitle) {
    sectionArray.push({
        title: accordionTitle,
        ingredients: ingredArray,
    })
}

function saveInArray(selectedItem, itemTitle) {
    if (selectedItem && itemTitle) {
        ingredArray.push(
            [selectedItem, itemTitle]
        )
    }

}

export default function IngredientsScreen({ navigation }) {
    const [visibleDialog, setVisibleDialog] = React.useState(false);
    const [visibleDialogItem, setVisibleDialogItem] = React.useState(false);
    const [accordionTitle, setAccordionTitle] = React.useState('Abschnitt ...');
    const [itemTitle, setItemTitle] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');
    const [selectedItem, setSelectedItem] = React.useState('');
    return (
        <View style={styles.container}>
            <View style={styles.ingredContainer}>
                <List.Section >
                    <List.Accordion
                        onLongPress={() => setVisibleDialog(true)}
                        title={accordionTitle}
                    // left={}
                    >
                        {sections.map((item, index) =>
                            <List.Accordion
                                key={index}
                                style={styles.pLeft}
                                title={item.title}
                                left={props => <List.Icon {...props}
                                />}>
                                {item.items.map((item, index) =>
                                    <List.Item
                                        key={index}
                                        title={item}
                                        onPress={() => { setSelectedItem(item); saveInArray(selectedItem, itemTitle); setVisibleDialogItem(true) }}
                                        left={() => (
                                            <Checkbox
                                                status='unchecked'
                                            />
                                        )} />
                                )}
                            </List.Accordion>
                        )}
                    </List.Accordion>
                </List.Section>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => saveSectonArray(accordionTitle)}>
                    <Icon name="chevron-back-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <View >
                {console.log('---- teil ', ingredArray, '--- komplettes Array ', sectionArray)}
                {/* {saveSectonArray.map((item, index) => 
                <View>
                    <Text>{item}</Text>
                    {itemTitle.map((item, index) =>
                        <Text>{item}</Text>
                    )}
                </View>

                 )}  */}

            </View>
            <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
                <Dialog.Title>Wähle den Titel</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        placeholder='Abschnitt ...'
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => { accordionTitle => setAccordionTitle(accordionTitle), setVisibleDialog(false) }}>Done</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog visible={visibleDialogItem} onDismiss={() => setVisibleDialogItem(false)}>
                <Dialog.Title>Wähle die Menge von {selectedItem}</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        placeholder='Menge ...'
                        maxLength={10}
                        onChangeText={text => setInputValue(text)}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => { setItemTitle(inputValue), setVisibleDialogItem(false) }}>Speichern</Button>
                    <Button onPress={() => setVisibleDialogItem(false)}>Abbrechen</Button>
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
        marginLeft: 32
    },
    button: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 100,

    },
})