import { useParams, useNavigate } from 'react-router-dom';
import { ProductContext } from "../context/ProductContext.js";
import {useContext} from "react";

function ProductDetail() {

    const { products } = useContext(ProductContext);

    const { id } = useParams();

    const navigate = useNavigate();

    const product = products.find(product => product.id === parseInt(id));

    const handleBackButton = () => {
        navigate('/products');
    }

    return (
        <section>
            { product ? (
                <>
                    <h2>{product.name}</h2>
                    <img src={`/assets/images/${product.image}`} alt="Product Image" width="300" height="300"/>
                    <p>Price: ${product.price}</p>
                    <p>Description: {product.description}</p>
                    <p>Category: {product.category}</p>
                    <p></p>
                    <button onClick={handleBackButton}>Back to Product List</button>
                </>
            ) : (
                <>
                    <h2>Product Not Found</h2>
                    <p>The product with ID {id} does not exist</p>
                    <button onClick={handleBackButton}>Back to Product List</button>
                </>
            )
            }
        </section>
    );
}

export default ProductDetail;