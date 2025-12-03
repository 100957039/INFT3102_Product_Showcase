import Image from "next/image";
import { ProductContext } from "./ProductContext.js";
import {useContext} from "react";
import Link from "next/link";
import {AuthContext} from "@/components/AuthContext";

export default function ProductList({
                                        products: propProducts,
                                        page = 1,
                                        totalProducts,
                                        totalPages = 1,
                                        onPageChange
                                    }) {
    const { products: contextProducts, setProducts } = useContext(ProductContext)
    const { user } = useContext(AuthContext);
    
    
    const products = contextProducts || [];

    const handleRemove = (productId) => {
        if(setProducts) {
            setProducts(products.filter(product => product.id !== productId));
        }
    }

    const handleDelete = async (productId) => {
        if (!confirm('Delete this product?')) return;

        try {
            const res = await fetch(`/api/products?id=${productId}`, {method: 'DELETE'});
            if (res.ok) {
                handleRemove(productId);
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            alert('Network error, failed to delete');
        }
    }

    if (products.length === 0) {
        return <p>No products available</p>
    }
    
    return (
        <div className="product-list">
            <h3>Products</h3>
            <ul>
                {products.map((product) => (
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
                        {(product.vendor === user?.email || user?.role === 'admin') && (
                            <div style={{display: 'flex', gap: '0.5rem'}}>
                                <Link href={`/dashboard/edit/${product.id}`} className="edit-link">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(product.id)} className="delete-btn">
                                    Delete
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {onPageChange && (
                <div className="pagination">
                    <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
