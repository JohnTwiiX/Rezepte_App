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

async function sortChip(chip) {
    try {
        let values = await AsyncStorage.multiGet(['types', 'collection']);
        let result = null;

        values.forEach(([key, value]) => {
            if (JSON.parse(value).includes(chip)) {
                result = key;
            }
        });

        return result; // Return the result
    } catch (error) {

    }
}

const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}


export function DataProvider({ children }) {
    const [data, setData] = useState({
        // Overview
        title: '',
        potionSize: '',
        workTime: '',
        cookingTime: '',
        types: '',
        category: [],
        collection: [],
        imgUri: '',
        // Ingredients
        receptArray: [],
        // preparation
        // Settings
        isFetched: false,
    });

    const setRecept = (recept) => {
        fetchData(recept).then((data) => {
            // setFetchedRecept(data);
            setData({
                // Overview
                title: data.title,
                potionSize: data.description.potionSize,
                workTime: data.description.workTime,
                cookingTime: data.description.cookingTime,
                types: data.description.receptType,
                category: data.description.category,
                collection: data.description.collection,
                imgUri: data.description.imgUri,
                // Ingredients
                receptArray: data.description.receptArray,
                // preparation
                preparation: data.description.preparation,
                // Settings
                isFetched: true,
            });
        });
    }

    const setChip = (chip) => {
        const updatedData = { ...data };
        sortChip(chip).then((result) => {
            updatedData[result] = [chip];
            updateData(updatedData);
        });
    }

    const updateData = (newData) => {
        setData(newData);
    };

    const deleteData = () => {
        setData({
            // Overview
            title: '',
            potionSize: '',
            workTime: '',
            cookingTime: '',
            types: '',
            category: [],
            collection: [],
            imgUri: '',
            // Ingredients
            receptArray: [],
            // preparation
            // Settings
            isFetched: false,
        })
    }

    return (
        <DataContext.Provider value={{ data, updateData, setRecept, setChip, deleteData }}>
            {children}
        </DataContext.Provider>
    );
}