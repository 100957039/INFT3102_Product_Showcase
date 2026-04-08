import Image from "next/image";
import { ProductContext } from "./ProductContext.js";
import {useContext} from "react";
import Link from "next/link";

export default function ProductList( {page, totalPages, onPageChange } ) {
    const { products } = useContext(ProductContext)

    return (
        <div className="product-list">
            <h3>Products</h3>
            <ul>
                {products.length === 0 ? (
                    <li>No products found</li>
                ) : (
                    products.map((product) => (
                        <li key={product.id}>
                            <Link href={`/products/product/${product.id}`}>
                                <span><h3>{product.name}</h3></span>
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
                            </Link>
                        </li>
                    ))
                )}
            </ul>

            <div className="pagination">
                <button
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}>Previous
                </button>

                <span>Page {page} of {totalPages}</span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}>Next
                </button>
            </div>
        </div>
    );

}
