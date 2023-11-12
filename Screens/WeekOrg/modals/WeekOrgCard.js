import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Card, Button, Text } from "react-native-paper";
import { SubtitleLine } from "./WeekOrgFilter";
import { mergeIngredients } from "../../Basket/BasketItem";
import React from "react";

export default function WeekOrgCard({ recipe, addRecipe, setCard, setVisible }) {
    const [ingredients, setIngredients] = React.useState([]);

    React.useEffect(() => {
        handleIngred();
    }, [recipe]);

    const handleIngred = () => {
        const recipeArray = [{
            title: recipe.title,
            ingred: recipe.description.recipeArray,
            potion: recipe.description.potionSize,
            crowd: 0,
        }]
        const ingreds = mergeIngredients(recipeArray);
        setIngredients(ingreds);
    }

    return (
        <TouchableWithoutFeedback onPress={() => setCard(false)}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', height: '80%' }}>
                <TouchableWithoutFeedback>
                    <Card style={{ padding: 8 }}>
                        <Card.Title titleStyle={styles.cardTitle} title={recipe.title} />
                        <Card.Cover source={{ uri: recipe.description.imgUri }} />
                        <Card.Content>
                            <View style={styles.cardContentIconbar}>{<SubtitleLine recipe={recipe} />}</View>
                            {ingredients.map((ingred, index) =>
                                <Text key={index} style={styles.ingredText}>- {ingred.quantity}{ingred.unit} {ingred.name}</Text>
                            )}
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={() => setCard(false)}>Abbrechen</Button>
                            <Button onPress={() => { addRecipe(); setCard(false), setVisible(false) }}>Eintragen</Button>
                        </Card.Actions>
                    </Card>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    cardContentIconbar: {
        margin: 16,
        alignItems: 'center'
    },
    ingredText: {
        fontSize: 22
    },
    cardTitle: {
        fontSize: 26,
        padding: 16
    }
})