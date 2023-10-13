import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function fetchData(recept) {
    const data = await getStorage('recepts');

    if (data) {
        const result = data.find(r => r.title === recept);
        return result;
    }
    return null;
}

const getStorage = async (title) => {
    try {
        const arrayInString = await AsyncStorage.getItem(title);
        if (arrayInString != null) {
            return JSON.parse(arrayInString);
        }
        return null;
    } catch (error) {
        console.log(`Error retrieving ${title}: ${error}`);
    }
}

const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}


export function DataProvider({ children, recept }) {

    const [data, setData] = useState({
        // Overview
        title: '',
        potionSize: '',
        workTime: '',
        cookingTime: '',
        chipType: '',
        chipsCategory: '',
        chipsCollection: '',
        // Ingredients
        receptArray: [],
        // preparation

        // Settings
        isFetched: false
    });

    React.useEffect(() => {
        if (recept) {
            fetchData(recept).then((data) => {
                // setFetchedRecept(data);
                setData({
                    // Overview
                    title: data.title,
                    potionSize: data.description.potionSize,
                    workTime: data.description.workTime,
                    cookingTime: data.description.cookingTime,
                    chipType: data.description.receptType,
                    chipsCategory: data.description.category,
                    chipsCollection: data.description.collection,
                    // Ingredients
                    receptArray: data.description.receptArray,
                    // preparation
                    preparation: data.description.preparation,
                    // Settings
                    isFetched: true
                });
            });
        };
    }, []);

    const updateData = (newData) => {
        setData(newData);
    };

    return (
        <DataContext.Provider value={{ data, updateData }}>
            {children}
        </DataContext.Provider>
    );
}