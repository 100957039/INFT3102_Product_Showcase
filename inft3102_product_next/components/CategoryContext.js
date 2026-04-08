import {createContext, useState} from "react";

export const CategoryContext = createContext(null);

export function CategoryProvider({children}) {

    const [categories, setCategories] = useState([
        'Fruit',
        'Vegetable',
        'Dairy'
    ]);

    const value = {
        categories,
        setCategories
    }

    return (
        <CategoryContext.Provider value={{ categories, setCategories }}>
            {children}
        </CategoryContext.Provider>
    );
}