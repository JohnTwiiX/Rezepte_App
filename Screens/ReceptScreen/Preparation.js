import * as React from 'react';
import { Button, TextInput, View } from 'react-native';
import { List } from 'react-native-paper';
import { sectionArray } from './Ingredients';

export default function PreparationsScreen({ navigation }) {
    React.useEffect(() => {
        function updateView() {
            console.log('---- Aktualisiert')
        }

        updateView();
    }, [sectionArray]);
    return (
        <View style={{ flex: 1, margin: 8 }}>
            <List.Section style={{}}>
                {sectionArray.map((item, index) =>
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

        </View>
    );
}