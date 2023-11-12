import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Checkbox, Dialog, List, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { getArrayFromStorage, saveArrayStorage } from '../modals/StorageService';

export function mergeIngredients(recipes) {
    const mergedIngredients = [];

    // Durchlaufe jedes Rezept
    for (const recipe of recipes) {
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
                let adjustedQuantity = parseFloat(quantity);
                const newPotion = parseInt(JSON.parse(recipe.potion).crowd) + parseInt(recipe.crowd)
                let result = (adjustedQuantity / parseFloat(JSON.parse(recipe.potion).crowd) * newPotion)

                if (existingIngredient) {
                    // Wenn die Zutat bereits in mergedIngredients ist, aktualisiere die Menge
                    existingIngredient.quantity += result;
                } else {
                    // Andernfalls füge eine neue Zutat hinzu
                    mergedIngredients.push({
                        quantity: result,
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
        handleFinished();
    }, [item]);

    React.useEffect(() => {
        saveArrayStorage('@basketFinished', finished);
    }, [finished.length]);

    const handleFinished = async () => {
        const result = await getArrayFromStorage('@basketFinished');
        setFinished(result || []); // Setze auf ein leeres Array, wenn result null ist
    };
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

    const deleteRecipe = async () => {
        const basketArray = await getArrayFromStorage('@basket');
        const newBasketArray = basketArray.filter((prevItem) => prevItem.title !== selected);
        await saveArrayStorage('@basket', newBasketArray);
        closeDialog();
    }

    return (
        <View style={{ height: '100%', }}>
            <Text variant="displaySmall" style={styles.title}>Deine Einkaufsliste</Text>
            <List.Subheader style={styles.subHeader}>Ausgewählte Rezepte:</List.Subheader>
            <View style={styles.chipView}>
                {item.map((recipe, index) =>
                    <TouchableRipple
                        key={index}
                        style={[styles.chipTouch, { backgroundColor: theme.button }]}
                        onPress={() => { setSelected(recipe.title); openDialog(); }}
                    >
                        <View style={styles.chipContainer}>
                            {recipe.uri > 0 ?
                                <Avatar.Image size={36} source={{ uri: recipe.uri }} />
                                :
                                <Avatar.Image size={36} source={{ uri: 'https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_960_720.jpg' }} />
                            }
                            <Text style={styles.chipText}>{recipe.title} </Text>
                        </View>
                    </TouchableRipple>
                )}
            </View>
            <List.Subheader style={styles.subHeader}>Zutaten:</List.Subheader>
            <ScrollView style={{}}>
                {ingredients.map((recipe, index) =>
                    <TouchableRipple key={index} style={styles.itemTouch} onPress={() => {
                        if (finished.includes(recipe.name)) {
                            // Das Element ist bereits im Array, also entfernen wir es
                            setFinished((prevFinished) => prevFinished.filter((item) => item !== recipe.name));
                        } else {
                            // Das Element ist nicht im Array, also fügen wir es hinzu
                            setFinished([...finished, recipe.name]);
                        }
                    }} >
                        <View style={styles.itemContainer}>
                            {/* <View style={[finished.includes(recipe.name) ? styles.strikethrough : {}]} /> */}
                            <View style={styles.itemCheck}>
                                <Checkbox color='rgba(0,0,0,0.5)' status={finished.includes(recipe.name) ?
                                    'checked' : 'unchecked'} />
                            </View>
                            <Text
                                style={[styles.itemText, finished.includes(recipe.name) ? styles.textColor : {}]}>
                                {Number.isInteger(recipe.quantity) ? recipe.quantity : recipe.quantity.toFixed(2).replace(".", ",")}{recipe.unit} {recipe.name}
                            </Text>
                        </View>
                    </TouchableRipple>
                )}
            </ScrollView>
            <Dialog visible={visible} onDismiss={closeDialog}>
                <Dialog.Title>Du möchtest Recipe {selected} löschen?</Dialog.Title>
                <Dialog.Actions>
                    <Button onPress={() => { deleteRecipe(); setIsLoading(true); }}>Ja</Button>
                    <Button onPress={() => { closeDialog() }}>Nein</Button>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
}

const styles = StyleSheet.create(
    {
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