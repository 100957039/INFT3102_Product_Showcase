import {createContext, useState} from 'react';

// Components will access data via useContext(ProductContext)
export const ProductContext = createContext(null);

export function ProductProvider({ children }) {

    const [products, setProducts] = useState([
        {id: 1, name: 'Apple', price: 0.50, description: "It's an apple.", category: "fruits", image: 'apple.webp'},
        {id: 2, name: 'Orange', price: 1.23, description: "It's an orange.", category: "fruits", image: 'orange.webp'},
        {id: 3, name: 'Dragon Fruit', price: 2.28, description: "It's a dragon fruit.", category: "fruits", image: 'dragon_fruit.webp'},
        {id: 4, name: 'Banana', price: 0.30, description: "It's a banana.", category: "fruits", image: 'banana.webp'},
        {id: 5, name: 'Pineapple', price: 3.97, description: "It's a pineapple.", category: "fruits", image: 'pineapple.webp'},
        {id: 6, name: 'Carrot', price: 3.12, description: "It's a carrot.", category: "vegetables", image: 'carrot.webp'},
        {id: 7, name: 'Tomato', price: 2.10, description: "It's a tomato.", category: "vegetables", image: 'tomato.webp'},
        {id: 8, name: 'Pepper', price: 1.32, description: "It's a pepper.", category: "vegetables", image: 'pepper.webp'},
        {id: 9, name: 'Cucumber', price: 1.97, description: "It's a cucumber.", category: "vegetables", image: 'cucumber.webp'},
        {id: 10, name: 'Milk', price: 4.99, description: "It's milk.", category: "dairy", image: 'milk.webp'},
        {id: 11, name: 'Cheese', price: 5.48, description: "It's cheese.", category: "dairy", image: 'cheese.webp'},
        {id: 12, name: 'Yogurt', price: 2.99, description: "It's yogurt.", category: "dairy", image: 'yogurt.webp'}
    ]);


    return (
        <ProductContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductContext.Provider>
    );
}