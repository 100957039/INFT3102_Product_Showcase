import ProductCard from "../ui/ProductCard.jsx";
import { ProductContext } from "../context/ProductContext.js";
import {useContext} from "react";


function Products() {

    const { setFilter } = useContext(ProductContext);

    const handleChange = (category) => {
        setFilter(category.target.value);
    };


    return (
        <section className="card">
            <h1>Product List</h1>
            <h3>Categories</h3>
            <select className="card" onChange={handleChange}>
                <option value="">All</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
            </select>
            <section className="card">
                <ProductCard />
            </section>
        </section>
    );
}

export default Products;