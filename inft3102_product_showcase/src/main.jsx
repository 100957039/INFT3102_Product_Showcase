import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";

// Calls the Apps file to know what to display on the page
createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/* Wrap App in BrowseRouter to handle routing, enables React Router */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
)
