// cd inft3102_product_showcase
// Start App: npm run dev
// Stop App: CTRL + C

import {lazy, Suspense} from 'react';
import Header from './ui/Header.jsx';
import Footer from './ui/Footer.jsx';
import NavBar from './ui/NavBar.jsx';
import Home from './pages/Home.jsx';
import {Route, Routes} from "react-router-dom";


function App() {

    return (
        <div className="app-container">

            <Header title="My Product Showcase"/>

            <NavBar links={['Home', 'About', 'Blog']}/>

            <main className="content">
                { /* Uses Routes/Route from React Router for dynamic navigation */ }
                <Routes>
                    <Route path="/" element={<Home/>} />
                </Routes>
            </main>

            <Footer />
        </div>
    )
}

export default App
