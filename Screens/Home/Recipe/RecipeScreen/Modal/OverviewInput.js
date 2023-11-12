import * as React from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput, useTheme } from 'react-native-paper';




export default function OverviewInput({ title, titleValue, setValue, inputRef }) {
    const theme = useTheme();
    const [isFocus, setFocus] = React.useState(false);

    const handleInputFocus = () => {
        setFocus(true);
    };

    const handleInputBlur = () => {
        setFocus(false);
    };

    const handleBackgroundPress = () => {
        Keyboard.dismiss();
    };

    const handleIcon = () => {
        if (title === 'potion') {
            return 'account-outline'
        } else if (title === 'work') {
            return 'clock-time-two-outline'
        } else {
            return 'pot-mix-outline'
        }
    }

    return (
        <View>
            <TextInput
                style={[
                    styles.input,
                    { backgroundColor: theme.color },
                    title === 'title' && { textAlign: 'left' } // Füge textAlign hinzu, wenn title === 'Titel'
                ]}
                label={
                    (title !== 'title') ? (
                        !titleValue && !isFocus ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name={handleIcon()} size={20} color='rgba(0, 0, 0, 0.3)' />
                            </View>
                        ) : null
                    ) : 'Titel'
                }
                ref={inputRef}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                keyboardType={title === 'title' ? 'default' : 'phone-pad'}
                value={titleValue}
                onChangeText={(value) => { setValue(value) }}
            />
        </View>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            padding: 8,
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between'
        },
        button: {
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
            marginBottom: 8,
            textAlign: 'center',
            borderTopRightRadius: 0,
        }
    });