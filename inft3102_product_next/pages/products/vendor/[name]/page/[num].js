import { ProductContext } from "@/components/ProductContext";
import { useContext, useEffect } from "react";
import ProductList from "@/components/ProductList";
import {useRouter} from "next/router";

export default function VendorPage({ products, name, page, totalProducts, totalPages }) {
    const { setProducts } = useContext(ProductContext);
    const router = useRouter();

    useEffect(() => {
        if (products) setProducts(products);
    }, [products, setProducts]);

    const handlePageChange = (newPage) => {
        router.push(`/products/vendor/${encodeURIComponent(name)}/page/${newPage}`);

    }

    return (
        <section className="card">
            <h1>Products by {name}</h1>
            <ProductList
                products={products}
                page={page}
                totalProducts={totalProducts}
                totalPages={totalPages}
            />

            <div className="pagination">
                <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
                    Next
                </button>
            </div>
        </section>
    );
}

export async function getServerSideProps({ params, query }) {
    const { name, num } = params;
    const page = parseInt(num || "1", 10);
    const limit = 5;
    const skip = (page - 1) * limit;

    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || "master";
    const contentType = "product";

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch Contentful products: ${response.statusText}`);
        const data = await response.json();

        const productList = (data.items || []).map(item => {
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

        const vendorProducts = productList.filter(p => p.vendor === name);

        const paginatedProducts = vendorProducts.slice(skip, skip + limit);
        const totalProducts = vendorProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            props: {
                products: paginatedProducts,
                name,
                page,
                totalProducts,
                totalPages
            }
        };
    } catch (err) {
        console.error('Error in getServerSideProps()', err.message);
        return {
            props: {
                products: [],
                name,
                page: 1,
                totalProducts: 0,
                totalPages: 1,
                error: 'Failed to fetch products: ' + err.message
            }
        };
    }
}
