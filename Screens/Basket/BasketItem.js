import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Checkbox, Dialog, List, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { getArrayFromStorage, saveArrayStorage } from '../modals/StorageService';

function mergeIngredients(recept) {
    const mergedIngredients = [];

    // Durchlaufe jedes Rezept
    for (const recipe of recept) {
        // Durchlaufe jedes "ingred" im Rezept
        for (const ingredientGroup of recipe.ingred) {
            // Durchlaufe jedes "ingredients" im "ingred"
            for (const ingredient of ingredientGroup.ingredients) {
                let quantity, unit, separator, name;
                if (ingredient.length === 4) {
                    [quantity, unit, separator, name] = ingredient;
                } else if (ingredient.length === 5) {
                    [quantity, , unit, separator, name] = ingredient;
                } else {
                    // Wenn die Länge nicht 4 oder 5 beträgt, überspringe dieses Ingredient
                    continue;
                }

                const existingIngredient = mergedIngredients.find((item) => item.name === name && item.unit === unit);

                if (existingIngredient) {
                    // Wenn die Zutat bereits in mergedIngredients ist, aktualisiere die Menge
                    let adjustedQuantity = parseFloat(quantity);

                    if (recipe.crowd === -1) {
                        adjustedQuantity *= 0.5;
                    } else if (recipe.crowd < -1) {
                        adjustedQuantity /= Math.abs(recipe.crowd) + 1;
                    } else if (recipe.crowd > 1) {
                        adjustedQuantity *= recipe.crowd + 1;
                    }

                    existingIngredient.quantity += adjustedQuantity;
                } else {
                    // Andernfalls füge eine neue Zutat hinzu
                    let adjustedQuantity = parseFloat(quantity);

                    if (recipe.crowd === -1) {
                        adjustedQuantity *= 0.5;
                    } else if (recipe.crowd < -1) {
                        adjustedQuantity /= Math.abs(recipe.crowd) + 1;
                    } else if (recipe.crowd > 1) {
                        adjustedQuantity *= recipe.crowd + 1;
                    }

                    mergedIngredients.push({
                        quantity: adjustedQuantity,
                        unit,
                        name,
                    });
                }
            }
        }
    }

    return mergedIngredients;
}


export default function BasketItem({ item, setIsLoading }) {
    const [ingredients, setIngredients] = React.useState([]);
    const [finished, setFinished] = React.useState([]);
    const [selected, setSelected] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const theme = useTheme();

    React.useEffect(() => {
        handleIngred();
    }, [item]);

    const handleIngred = () => {
        const ingreds = mergeIngredients(item);
        setIngredients(ingreds);
    }

    const closeDialog = () => {
        setVisible(false);
    };

    const openDialog = () => {
        setVisible(true);
    };

    const deleteRecept = async () => {
        const basketArray = await getArrayFromStorage('@basket');
        const newBasketArray = basketArray.filter((prevItem) => prevItem.title !== selected);
        await saveArrayStorage('@basket', newBasketArray);
        closeDialog();
    }

    return (
        <View style={{ height: '100%' }}>
            <Text style={styles.title}>Deine Einkaufsliste</Text>
            <List.Section>
                <List.Subheader style={styles.subHeader}>Ausgewählte Rezepte:</List.Subheader>
                <View style={styles.chipView}>
                    {item.map((recept, index) =>
                        <TouchableRipple
                            key={index}
                            style={[styles.chipTouch, { backgroundColor: theme.colors.button }]}
                            onPress={() => { setSelected(recept.title); openDialog(); }}
                        >
                            <View style={styles.chipContainer}>
                                {recept.uri > 0 ?
                                    <Avatar.Image size={36} source={{ uri: recept.uri }} />
                                    :
                                    <Avatar.Image size={36} source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} />
                                }
                                <Text style={styles.chipText}>{recept.title} </Text>
                            </View>
                        </TouchableRipple>
                    )}
                </View>
                <List.Subheader style={styles.subHeader}>Zutaten:</List.Subheader>
                <ScrollView>
                    {ingredients.map((recept, index) =>
                        <TouchableRipple key={index} style={styles.itemTouch} onPress={() => {
                            if (finished.includes(recept.name)) {
                                // Das Element ist bereits im Array, also entfernen wir es
                                setFinished((prevFinished) => prevFinished.filter((item) => item !== recept.name));
                            } else {
                                // Das Element ist nicht im Array, also fügen wir es hinzu
                                setFinished([...finished, recept.name]);
                            }
                        }} >
                            <View style={styles.itemContainer}>
                                {/* <View style={[finished.includes(recept.name) ? styles.strikethrough : {}]} /> */}
                                <View style={styles.itemCheck}>
                                    <Checkbox color='rgba(0,0,0,0.5)' status={finished.includes(recept.name) ?
                                        'checked' : 'unchecked'} />
                                </View>
                                <Text style={[styles.itemText, finished.includes(recept.name) ? styles.textColor : {}]}>{recept.quantity}{recept.unit} {recept.name}</Text>
                            </View>
                        </TouchableRipple>
                    )}
                </ScrollView>
            </List.Section>
            <Dialog visible={visible} onDismiss={closeDialog}>
                <Dialog.Title>Du möchtest Recept {selected} löschen?</Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={() => { deleteRecept(); setIsLoading(true); }}>Ja</Button>
                    <Button onPress={() => { closeDialog() }}>Nein</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
}

const styles = StyleSheet.create({
    itemTouch: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginTop: 8,
        marginBottom: 8,
        marginRight: 24,
        marginLeft: 24,
        borderRadius: 10
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
    },
    itemText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold'
    },
    itemCheck: {
        marginLeft: 16
    },
    strikethrough: {
        position: 'absolute',
        top: '50%', // Vertikal zentrieren
        left: 16,
        right: 16,
        height: 1.5, // Höhe des Strichs
        backgroundColor: 'rgba(0,0,0,0.5)', // Farbe des Strichs
        zIndex: 1, // Damit der Strich unter dem Text und der Checkbox liegt
    },
    textColor: {
        color: 'rgba(0,0,0,0.5)', // Strich sichtbar machen
        textDecorationLine: 'line-through'
    },
    chipTouch: {
        margin: 8,
        borderRadius: 10
    },
    chipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 8,
    },
    chipText: {
        marginLeft: 16,
        fontSize: 16,
        fontWeight: '700'
    },
    chipView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 32
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 8,
        textDecorationLine: 'underline',
        textDecorationStyle: 'double'
    },
    subHeader: {
        fontSize: 18
    }
})