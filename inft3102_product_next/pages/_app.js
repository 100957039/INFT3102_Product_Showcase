import "@/styles/index.css";
import {ProductProvider} from "@/components/ProductContext.js";
import {CategoryProvider} from "@/components/CategoryContext";

export default function App({ Component, pageProps}) {
    return (
        <ProductProvider>
            <CategoryProvider>
                <Component {...pageProps} />
            </CategoryProvider>
        </ProductProvider>
    )
}