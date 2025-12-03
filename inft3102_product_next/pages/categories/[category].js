import {ProductContext} from "@/components/ProductContext";
import {useContext, useEffect} from "react";
import ProductFilter from "@/components/ProductFilter";
import ProductList from "@/components/ProductList";

export default function CategoryPage( {products, error, category, page, totalProducts, totalPages} ) {

    const {setProducts} = useContext(ProductContext);

    useEffect(() => {
        if(products) setProducts(products);
    },  [products, setProducts])


    return (
        <div className="content">
            <section className="card">
                <h1>Products in {category}</h1>
                <ProductFilter />
                {error ? (
                    <p role="alert">{error}</p>
                    ) : (
                        <ProductList products={products} page={page} totalProducts={totalProducts} totalPages={totalPages} />
                    )
                }
            </section>
        </div>
    )
}

export async function getServerSideProps({params, query}) {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || 'master';
    const contentType = 'product';
    const limit = 5;
    const page = parseInt(query.page || '1', 10);
    const skip = (page - 1) * limit;
    const category = params.category;

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}&limit=${limit}&skip=${skip}&fields.category=${encodeURIComponent(category)}`;

    try{
        console.log('Fetching products from Contentful for category', category);
        const response = await fetch(url);

        if(!response.ok){
            console.log('Failed to fetch products from Contentful for category', category);
            throw new Error('Failed to fetch Contentful products for category');
        }

        const data = await response.json();
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
            props: {
                products,
                error: null,
                category,
                page,
                totalProducts,
                totalPages
            }
        };

    } catch(error){
        console.error('Error fetching products from Contentful for category', error.message);

        return {
            props: {
                products: [],
                error: 'Failed to fetch products from Contentful for category: ' + error.message + '',
                category,
                page: 1,
                totalProducts: 0,
                totalPages: 1
            }
        };
    }
}