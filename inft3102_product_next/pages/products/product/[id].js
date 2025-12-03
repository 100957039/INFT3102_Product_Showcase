import {useContext} from "react";
import {ProductContext} from "@/components/ProductContext";
import {useRouter} from "next/router";
import ProductDetail from "@/components/ProductDetail";

export default function ProductPage( {error} ) {
    const { products } = useContext(ProductContext);
    const router = useRouter();
    const { id } = router.query;

    const product = id ? products.find(product => product.id === parseInt(id)) : null;

    if(error){
        return (
            <section className="card">
                <p role="alert">{error}</p>
            </section>
        );
    }

    if(!product){
        return (
            <section className="card">
                <p>Loading product...</p>
            </section>
        );
    }

    return (
        <ProductDetail product={product}/>
    );
}