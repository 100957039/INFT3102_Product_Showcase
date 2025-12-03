import {ProductContext} from "@/components/ProductContext";
import {useContext, useEffect} from "react";
import ProductList from "@/components/ProductList";

export default function VendorPage( {products, name, num}) {

    const {setProducts} = useContext(ProductContext);

    useEffect( () => {
        if(products) setProducts(products);
    },  [products, setProducts]);

    return (
        <section className="card">
            <h1>Products by {name}</h1>
            <ProductList
                products={products}
                page={num}
                totalProducts={products.length}
                totalPages={1}
            />
        </section>
    );
}

export async function getServerSideProps({ params }) {
    const { name, num } = params;
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || 'master';
    const contentType = 'product';

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}`;

    try {
        console.log('Fetching products from Contentful');

        const response = await fetch(url);

        if (!response.ok) {
            console.log('Failed to fetch Contentful products', response.status, response.statusText);
            throw new Error('Failed to fetch Contentful products');
        }

        const data = await response.json();
        console.log('Contentful API response', data);
        if(!data.items || data.items.length === 0){
            console.error('No published product found in Contentful response');
            throw new Error('No published product found in Contentful response');
        }

        const productList = data.items.map((item) => {
            const imageId = item.fields.image?.sys?.id;
            const asset = data.includes?.Asset?.find(a => a.sys.id === imageId);

            return {
                id: item.sys.id,
                name: item.fields.name,
                price: item.fields.price,
                vendor: item.fields.vendor,
                description: item.fields.description,
                category: item.fields.category,
                image: `https:${asset.fields.file.url}` || null
            };
        });

        const products = productList.filter(p => p.vendor === name);

        return {
            props: {
                products,
                name,
                num,
                error: null
            }
        };

    } catch(err){
        console.error('Error in getServerSideProps()', err.message);
        return {
            props:{
                products: [],
                error: 'Failed to fetch products: ' + err.message,
            }
        };
    }
}