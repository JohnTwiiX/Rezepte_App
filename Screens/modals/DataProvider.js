import React, { createContext, useContext, useState } from 'react';
import { getArrayFromStorage, multiGetStorage } from './StorageService';

async function fetchData(recept) {
    const data = await getArrayFromStorage('recepts');

    if (data) {
        const result = data.find(r => r.title === recept);
        return result;
    }
    return null;
}

async function sortChip(chip) {
    try {
        let values = await multiGetStorage(['types', 'collection']);
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
        isEditMode: false,
        inBasket: false,
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
                isEditMode: false,
                inBasket: false,
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