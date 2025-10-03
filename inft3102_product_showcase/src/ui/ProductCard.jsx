import { useContext } from "react";
import { ProductContext } from "../context/ProductContext.js";
import { useNavigate } from 'react-router-dom';

function ProductCard() {

    const { filteredProducts } = useContext(ProductContext)

    const navigate = useNavigate();

    const handleViewDetailsButton = (id) => {
        navigate(`/products/detail/${id}`);
    }

    return (
        <div className="product-list">
            <h3>Products</h3>
            <ul>
                {filteredProducts.map((product) =>
                    <li key={product.id}>
                        <span><h3>{product.name}</h3></span>
                        <img src={`/assets/images/${product.image}`} alt="Product Image" width="300" height="300"/>
                        <button onClick={() => handleViewDetailsButton(product.id)}>View Details</button>
                    </li>
                )}
            </ul>
        </div>
    );

}

export default ProductCard;