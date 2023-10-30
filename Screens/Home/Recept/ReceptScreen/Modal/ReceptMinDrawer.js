import * as React from 'react';
import { View, PanResponder, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Text, Button, useTheme } from 'react-native-paper';

export default function ReceptMinDrawer({ recepts, handleCrow }) {
    const [openDetailViews, setOpenDetailViews] = React.useState(Array(recepts.description.receptArray.length).fill(false));
    const theme = useTheme();

    const panResponders = React.useMemo(() =>
        recepts.description.receptArray.map((item, index) =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: (e, gestureState) => {
                    // Check if the gesture is a horizontal swipe
                    return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
                },
                onPanResponderMove: (e, gestureState) => {
                    // Scroll lock threshold (adjust as needed)
                    const scrollLockThreshold = 20;
                    if (Math.abs(gestureState.dy) > scrollLockThreshold) {
                        // Allow vertical scrolling
                        return false;
                    }
                    if (gestureState.dx > 50) {
                        const updatedOpenDetailViews = [...openDetailViews];
                        updatedOpenDetailViews[index] = true;
                        setOpenDetailViews(updatedOpenDetailViews);
                    } else if (gestureState.dx < -50) {
                        const updatedOpenDetailViews = [...openDetailViews];
                        updatedOpenDetailViews[index] = false;
                        setOpenDetailViews(updatedOpenDetailViews);
                    }
                },
            })
        ), [openDetailViews]
    );

    return (
        <View style={{ height: '100%' }}>
            {recepts.description.receptArray.map((item, index) => (
                <View
                    key={index}
                >
                    <View style={{ borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.5)' }}>
                        <Text style={{ textAlign: 'center', fontSize: 22 }}>{item.title}</Text>
                    </View>
                    <ScrollView
                        style={{ minHeight: openDetailViews[index] ? 250 : 50, maxHeight: 250, width: '100%' }}
                        {...panResponders[index].panHandlers}
                    >
                        <Text style={{ fontSize: 18 }}>{recepts.description.preparation[item.title]}</Text>
                    </ScrollView>
                    {openDetailViews[index] && (
                        <View style={[styles.modalContainer, { backgroundColor: theme.color }]}>
                            <View style={{ maxHeight: 200 }}>
                                {item.ingredients.map((ingred, ingIndex) => (
                                    <Text key={ingIndex} style={{ fontSize: 18 }}>{handleCrow(ingred)}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        left: 0,
        zIndex: 2,
        width: '50%',
        padding: 8,
        alignSelf: 'flex-start',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        minHeight: 30,
        marginTop: 36
    },
});
