import ProductList from "@/components/ProductList.js";
import ProductFilter from "@/components/ProductFilter";
import {useContext, useEffect} from "react";
import {ProductContext} from "@/components/ProductContext";
import {useRouter} from "next/router";

function Products( {products, error, page, totalProducts, totalPages} ) {

    const {setProducts} = useContext(ProductContext);
    const router = useRouter();

    useEffect(() => {
        if(products) setProducts(products);
    }, [products, setProducts]);

    const handlePageChange = (newPage) => {
        router.push(`/products?page=${newPage}`);
    }

    return (
        <>
            <section className="card">
                <h1>Products</h1>
                <ProductFilter />
                { error ? (
                    <p role="alert">{error}</p>
                ) : (
                    <ProductList
                        products={products}
                        page={page}
                        totalProducts={totalProducts}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </section>
        </>
    );
}

export async function getServerSideProps( {query} ) {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || 'master';
    const contentType = 'product';
    const limit = 5;
    const page = parseInt(query.page || '1', 10);
    const skip = (page - 1) * limit;

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}&limit=${limit}&skip=${skip}`;

    try {
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

        const products = (data.items || []).map((item) => {
            const imageId = item.fields.image?.sys?.id;
            const asset = data.includes?.Asset?.find(a => a.sys.id === imageId);

            return {
                id: item.sys.id,
                name: item.fields.name,
                price: item.fields.price,
                vendor: item.fields.vendor,
                description: item.fields.description,
                category: item.fields.category,
                image: asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : null
            };
        });

        const totalProducts = data.total || 0;
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            props:{
                products,
                error: null,
                page,
                totalProducts,
                totalPages
            }
        };

    } catch(err){
        console.error('Error in getServerSideProps()', err.message);
        return {
            props:{
                products: [],
                error: 'Failed to fetch products: ' + err.message,
                page: 1,
                totalProducts: 0,
                totalPages: 1
            }
        };
    }
}

export default Products;