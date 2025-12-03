import {createContext, useEffect, useState} from "react";

export const VendContext = createContext(null);

export function VendProvider( {children} ){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        fetch('/api/vend/me')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                setUser(data?.user || null);
                setLoading(false);
            })
            .catch( () => setLoading(false) );
    }, []);


    const login = (email, password) => {
        return fetch('/api/vend/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        })
            .then(r=> r.json())
            .then(data => {
                if(data.user) setUser(data.user);
                return data;
            });
    };

    const logout = () => {
        return fetch('/api/vend/logout')
            .then(() => setUser(null));
    };

    return (
        <VendContext.Provider value={{user, login, logout, loading}}>
            {children}
        </VendContext.Provider>
    );

}