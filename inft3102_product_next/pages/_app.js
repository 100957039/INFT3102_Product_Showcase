import "@/styles/index.css";
import {ProductProvider} from "@/components/ProductContext.js";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps}) {
    return (
        <ProductProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ProductProvider>
    )
}