import "@/styles/index.css";
import {ProductProvider} from "@/components/ProductContext.js";
import {CategoryProvider} from "@/components/CategoryContext.js";
import Layout from "@/components/Layout";
import {AuthProvider} from "@/components/AuthContext";

export default function App({ Component, pageProps}) {
    return (
        <ProductProvider>
            <CategoryProvider>
                <AuthProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                    </AuthProvider>
            </CategoryProvider>
        </ProductProvider>
    )
}