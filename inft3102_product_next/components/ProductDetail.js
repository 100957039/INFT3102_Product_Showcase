import Image from "next/image";
import { ProductContext } from "./ProductContext.js";
import {useContext} from "react";

export default function ProductDetail({ id }) {
    const { products } = useContext(ProductContext)

    const product = id ? products.find(product => product.id === id) : null;

    return (
        <div className="product-detail">
            { product ? (
                <div>
                    <h2>{product.name}</h2>
                    <div style={{ maxWidth: "300px" }}>
                        {product.image && (
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={300}
                                height={300}
                                layout="responsive"
                            />
                        )}
                    </div>
                    <p><strong>Price: </strong>${product.price}</p>
                    <p><strong>Supplied By: </strong>{product.vendor}</p>
                    <p><strong>Description</strong></p>
                    <p>{product.description}</p>
                </div>
            ) : (
                <>
                    <p>Product Not Found (ID {id})</p>
                </>
            )}
        </div>
    );

}
