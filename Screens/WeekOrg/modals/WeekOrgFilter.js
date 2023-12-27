import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Chip, Searchbar, Text, useTheme } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';




// Eine Funktion, die die searchQuery mit den Rezepten vergleicht
const filterRecipes = (searchQuery, recipes) => {
    // Wenn die searchQuery leer ist, gib alle Rezepte zurück
    if (searchQuery === "") {
        return recipes;
    }
    // Sonst filtere die Rezepte nach den verschiedenen Eigenschaften
    else {
        return recipes.filter((recipe) => {
            // Überprüfe, ob die searchQuery im title enthalten ist
            const titleMatch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
            // Überprüfe, ob die searchQuery in einem der description.recipeType[] enthalten ist
            const recipeTypeMatch = recipe.description.recipeType.some((type) =>
                type.toLowerCase().includes(searchQuery.toLowerCase())
            );
            // Überprüfe, ob die searchQuery in einem der description.category[] enthalten ist
            const categoryMatch = recipe.description.category.some((category) =>
                category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            // Überprüfe, ob die searchQuery in einem der description.collection[] enthalten ist
            const collectionMatch = recipe.description.collection.some((collection) =>
                collection.toLowerCase().includes(searchQuery.toLowerCase())
            );
            // Überprüfe, ob die searchQuery in einem der description.recipeArray[i].ingredients[] enthalten ist
            const ingredientsMatch = recipe.description.recipeArray.some((recipeItem) =>
                recipeItem.ingredients.some((ingredient) =>
                    ingredient.some((ingred) =>
                        ingred.toLowerCase().includes(searchQuery.toLowerCase()))
                )
            );
            // Gib true zurück, wenn mindestens eine der Bedingungen erfüllt ist
            return (
                titleMatch ||
                recipeTypeMatch ||
                categoryMatch ||
                collectionMatch ||
                ingredientsMatch
            );
        });
    }
};

export const SubtitleLine = ({ recipe }) => {
    const potionSize = JSON.parse(recipe.description.potionSize);
    const workTime = JSON.parse(recipe.description.workTime);
    const cookingTime = JSON.parse(recipe.description.cookingTime);
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='account-outline' size={18} style={{ marginRight: 4 }} />
            <Text>{potionSize.crowd} {potionSize.unit}</Text>
            <Text>  |  </Text>
            <Icon name='clock-time-two-outline' size={18} style={{ marginRight: 4 }} />
            <Text>{workTime.crowd}{workTime.unit}</Text>
            <Text>  |  </Text>
            <Icon name='pot-mix-outline' size={18} style={{ marginRight: 4 }} />
            <Text>{cookingTime.crowd}{cookingTime.unit}</Text>
        </View>
    );
};

export default function WeekOrgFilter({ recipes, setSelectedRecipe, setCard }) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filteredRecipes, setFilteredRecipes] = React.useState(recipes);
    const theme = useTheme();
    // Eine Funktion, die aufgerufen wird, wenn sich die searchQuery ändert
    const onChangeSearch = (query) => {
        // Setze die searchQuery im State
        setSearchQuery(query);
        // Rufe die filterRecipes-Funktion auf, um das gefilterte Array von Rezepten zu erhalten
        const filteredRecipes = filterRecipes(query, recipes);
        // Setze die filteredRecipes im State
        setFilteredRecipes(filteredRecipes);
    };

    return (
        <View style={styles.modalView}>
            <Text style={styles.modaltext}>Welches Rezept möchtest du auswählen?</Text>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
            <ScrollView style={styles.cardContainer}>
                {filteredRecipes.map((recipe, index) => (
                    <Card key={index} style={[styles.card, { backgroundColor: theme.color }]} onPress={() => { setSelectedRecipe(recipe); setCard(true) }}>
                        <View style={styles.cardView}>
                            <Avatar.Image size={50} source={{ uri: recipe.description.imgUri }} />
                            <View style={styles.textContainer}>
                                <Text style={styles.cardText}>{recipe.title}</Text>
                                <SubtitleLine recipe={recipe} />
                            </View>
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    modalView: {
        borderRadius: 10,
        padding: 16,
        backgroundColor: "white",
        maxHeight: '80%'
    },
    modaltext: {
        fontSize: 24,
        marginBottom: 16
    },
    card: {
        margin: 8,
    },
    cardContainer: {
        margin: 16,
        marginTop: 16
    },
    cardText: {
        fontSize: 24,
    },
    cardView: {
        flexDirection: 'row',
        padding: 8
    },
    textContainer: {
        marginLeft: 8
    }
})