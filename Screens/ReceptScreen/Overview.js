import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Divider } from 'react-native-paper';
import ReceptTypeChips from '../modals/OverviewChips';
import CategoryChips from '../modals/OverviewCategory';
import CollectionChips from '../modals/OverviewCollection';

export default function Overview({ navigation }) {
    const [title, setTitle] = React.useState("");
    const [potionSize, setPotionSize] = React.useState("");
    const [workTime, setWorkTime] = React.useState("");
    const [cookingTime, setCookingTime] = React.useState("");
    return (
        <ScrollView>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    label="Titel"
                    value={title}
                    onChangeText={title => setTitle(title)}
                />
                <View style={styles.chipContainer} >
                    <Text>Rezeptart:</Text>
                    <ReceptTypeChips />
                    <Divider />
                </View>
                <View style={styles.chipContainer}>
                    <Text>Kategorie:</Text>
                    <CategoryChips />
                </View>
                <View style={styles.chipContainer}>
                    <Text>Sammlungen:</Text>
                    <CollectionChips />
                </View>
                <TextInput
                    style={styles.input}
                    label="Portionsgröße"
                    value={potionSize}
                    onChangeText={potionSize => setPotionSize(potionSize)}
                />
                <TextInput
                    style={styles.input}
                    label="Vorbereitungszeit"
                    value={workTime}
                    onChangeText={workTime => setWorkTime(workTime)}
                />
                <TextInput
                    style={styles.input}
                    label="Kochzeit"
                    value={cookingTime}
                    onChangeText={cookingTime => setCookingTime(cookingTime)}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8
    },
    button: {
        position: 'absolute',
        top: 16,
        left: 16,
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 100,

    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    chipContainer: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    input: {
        marginTop: 8,
        marginBottom: 8
    }
});