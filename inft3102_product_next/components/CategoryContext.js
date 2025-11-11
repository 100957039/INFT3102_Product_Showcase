import {createContext} from "react";

export const CategoryContext = createContext(null);

export function CategoryProvider({children}) {

    const [categories, setCategories] = useState([
        'Tech',
        'Lifestyle',
        'College',
        'Travel',
        'Food'
    ]);

    const value = {
        categories,
        setCategories
    }

    return (
        <CategoryContext.Provider value={null}>
            {children}
        </CategoryContext.Provider>
    );
}