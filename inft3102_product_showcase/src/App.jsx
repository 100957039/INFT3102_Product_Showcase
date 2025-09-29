// cd inft3102_product_showcase
// Start App: npm run dev
// Stop App: CTRL + C

import {lazy, Suspense} from 'react';
import Header from './ui/Header.jsx';
import Footer from './ui/Footer.jsx';
import NavBar from './ui/NavBar.jsx';
import Home from './pages/Home.jsx';
import ProductDetail from "./pages/ProductDetail.jsx";
import {Route, Routes} from "react-router-dom";

// Lazily load Blog.jsx to reduce initial bundle page size
const Products = lazy(() => import('./pages/Products.jsx'));

function App() {

    return (
        <div className="app-container">

            <Header title="Product Showcase"/>

            <NavBar links={['Home', 'Products']}/>

            <main className="content">
                { /* Uses Routes/Route from React Router for dynamic navigation */ }
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/products" element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <Products />
                        </Suspense>
                    } />
                    <Route path="/product/:id" element={<ProductDetail/>} />
                </Routes>
            </main>

            <Footer />
        </div>
    )
}

export default App
