import {ProductContext} from "@/components/ProductContext";
import {useContext, useEffect} from "react";
import ProductList from "@/components/ProductList";

export default function VendorPage( {products, vendor, page}) {

    const {setProducts} = useContext(ProductContext);

    useEffect( () => {
        if(products) setProducts(products);
    },  [products, setProducts]);

    return (
        <section className="card">
            <h1>Products by {vendor} - Page {page}</h1>
            <ProductList
                products={products}
                page={page}
                totalProducts={products.length}
                totalPages={1}
            />
        </section>
    );
}

export async function getServerSideProps( {params} ){

    const {name} = params;
    const res = await
        fetch(`http://localhost:3000/api/products?vendor=${encodeURIComponent(name)}`);

    const products = await res.json();
    return {
        props: {
            products,
            vendor: name,
            page: '1'
        }
    }
}