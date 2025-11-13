import {createContext, useState} from 'react';

// Components will access data via useContext(ProductContext)
export const ProductContext = createContext(null);

export function ProductProvider({ children }) {

    const [products, setProducts] = useState([
    ]);


    return (
        <ProductContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductContext.Provider>
    );
}