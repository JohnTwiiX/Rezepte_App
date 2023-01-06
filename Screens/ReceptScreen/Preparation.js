import * as React from 'react';
import { Button, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { List } from 'react-native-paper';
import { sectionArray } from './Ingredients';

export default function PreparationsScreen({ navigation }) {
    const [sections, setSections] = React.useState([]);
    const [actuel, setActuel] = React.useState(false)
    React.useEffect(() => {
        setSections(sectionArray);
        setActuel(false)
    }, [actuel]);
    return (
        <View style={{ flex: 1, margin: 8 }}>
            <Button title='Aktualisieren' onPress={() => setActuel(true)} />
            <List.Section style={{}}>
                {sections.map((item, index) =>
                    <List.Accordion
                        key={index}
                        title={item.title}
                        style={{ borderWidth: 1, }}
                    >
                        <TextInput
                            multiline={true}
                            returnKeyType="done"
                            textAlignVertical='top'
                            style={{ height: 40, borderColor: 'gray', backgroundColor: 'white', height: '100%', overflow: 'hidden', padding: 8 }}
                            placeholder="Type something here!"
                            onChangeText={text => console.log(text)}
                        />
                    </List.Accordion>
                )}
            </List.Section>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    style={{ backgroundColor: 'blue' }}
                    onPress={() => {
                        // Hier kannst du den Navigation-Stack auf den HomeScreen zurücksetzen:
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                        // Hier könntest du die Werte in den useStates zurücksetzen:
                        setSections([]);
                        setActuel(false);
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Rezept abspeichern</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}