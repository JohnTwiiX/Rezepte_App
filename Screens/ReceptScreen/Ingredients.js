import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { List, Checkbox } from 'react-native-paper';

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

export default function IngredientsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.ingredContainer}>
                <List.Section >
                    <List.Accordion
                        title="Abschnitt ..."
                        left={props => <List.Icon {...props}
                        />}>
                        {sections.map((item, index) =>
                            <List.Accordion
                                style={styles.pLeft}
                                title={item.title}
                                left={props => <List.Icon {...props}
                                />}>
                                {item.items.map((item, index) =>
                                    <List.Item
                                        title={item}
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
            </View>
            <View >
                <Text>Zutaten screen</Text>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row'
    },
    ingredContainer: {
        width: '60%',
        // backgroundColor: 'green'
    },
    pLeft: {
        marginLeft: 32
    }
})