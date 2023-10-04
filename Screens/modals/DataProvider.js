import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}

export function DataProvider({ children }) {
    const [data, setData] = useState({
        // Overview
        title: '',
        potionTime: '',
        workTime: '',
        cookingTime: '',
        chipType: '',
        chipsCategory: '',
        chipsCollection: '',

        // Ingredients
        data10: '',

        // preparation
        data: '',
    });

    const updateData = (newData) => {
        setData(newData);
    };

    return (
        <DataContext.Provider value={{ data, updateData }}>
            {children}
        </DataContext.Provider>
    );
}