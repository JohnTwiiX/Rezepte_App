import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Card, Text, Dialog, Button, Chip, ActivityIndicator, useTheme } from 'react-native-paper';
import { getStorage } from './ReceptScreen/Overview';
import { ScrollView as GHScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ReceptMaxDrawer({ recepts, handleCrow }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const theme = useTheme();

    return (
        <View>
            <View style={{ flexDirection: 'row', marginTop: 16, marginBottom: 16 }}>
                <View style={{ width: '50%' }}>
                    <Text style={{ fontSize: 24 }}>Zutaten:</Text>
                </View>
                <View style={{ width: '50%' }}>
                    <Text style={{ fontSize: 24 }}>Zubereitung:</Text>
                </View>
            </View>
            <View style={{ minHeight: 250 }}>
                {recepts.description.receptArray.map((item, index) =>
                    <View key={index}>
                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.5)' }}><Text style={{ textAlign: 'center', fontSize: 22 }}>{item.title}</Text></View>
                        <View style={{ flexDirection: 'row', padding: 8 }}>
                            <View style={{ width: '50%', maxHeight: 200 }}>
                                {item.ingredients.map((ingred, index) =>
                                    <Text key={index} style={{ fontSize: 18 }}>{handleCrow(ingred)}</Text>
                                )}
                            </View>
                            <View style={{ width: '50%', maxHeight: 300 }}>
                                <GHScrollView>
                                    <Text style={{ fontSize: 18 }} key={index}>{recepts.description.preparation[item.title]}</Text>
                                </GHScrollView>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    m_8: {
        margin: 4
    },

});