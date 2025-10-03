// cd inft3102_product_showcase
// Start App: npm run dev
// Stop App: CTRL + C

import {lazy, Suspense} from 'react';
import Header from './ui/Header.jsx';
import Footer from './ui/Footer.jsx';
import NavBar from './ui/NavBar.jsx';
import Home from './pages/Home.jsx';
import {Route, Routes, Outlet} from "react-router-dom";
import ProductProvider from './context/ProductProvider.jsx';


const Products = lazy(() => import('./pages/Products.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function Layout() {
    return (
        <div className="app-container">
            <Header title="Product Showcase" />
            <NavBar links={['Home', 'Products']}/>
            <main className="content">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
}

function App() {
    return (
        <ProductProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home/>} />
                    <Route path="/products" element={
                        <Suspense fallback={<div>Loading Products, Please Wait...</div>}>
                            <Products />
                        </Suspense>
                    } />
                    <Route path="/products/detail/:id" element={
                        <Suspense fallback={<div>Loading Product, Please Wait...</div>}>
                            <ProductDetail />
                        </Suspense>
                    } />
                    <Route path="*" element={
                        <Suspense fallback={<div>Loading Error Page, Please Wait...</div>}>
                            <NotFound />
                        </Suspense>
                    } />
                </Route>
            </Routes>
        </ProductProvider>
    );
}

export default App
