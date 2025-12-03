import {createContext, useState} from 'react';

export const ProductContext = createContext(null);

export function ProductProvider({ children }) {

    const [products, setProducts] = useState([
    ]);

    const addProduct = (name, price, description, category) => {
        const newProduct = {
            id: products.length + 1,
            name: name,
            price: price,
            description: description || 'No description added',
            category: category,
            image: null
        };
        setProducts([...products, newProduct]);
    }

    return (
        <ProductContext.Provider value={{ products, setProducts, addProduct }}>
            {children}
        </ProductContext.Provider>
    );
}