import Link from "next/link";
import {useRouter} from "next/router";
import {AuthContext} from "@/components/AuthContext";
import LoginForm from "@/components/LoginForm";
import {useContext} from "react";

export default function NavBar({ links }) {
    const router = useRouter();
    const {user, logout} = useContext(AuthContext);

    const { pathname } = router || {};

    const isActive = (pathname) => router.pathname === pathname;

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link
                        href="/"
                        className={isActive('/') ? 'active' : ''}
                        aria-current={isActive('/') ? 'page' : undefined}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        href="/about"
                        className={isActive('/about') ? 'active' : ''}
                        aria-current={isActive('/about') ? 'page' : undefined}>
                        About
                    </Link>
                </li>
                <li>
                    <Link
                        href="/products"
                        className={isActive('/products') ? 'active' : ''}
                        aria-current={isActive('/products') ? 'page' : undefined}>
                        Products
                    </Link>
                </li>
                <li>
                    <Link
                        href="/products/vendor/John/page/1"
                        className={isActive('/products/vendor') ? 'active' : ''}
                        aria-current={isActive('/products/vendor') ? 'page' : undefined}>
                        Vendor (Route)
                    </Link>
                </li>

                {/* Authentication UI */}
                <li style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    {user ? (
                        <>
                                <span style={{color: 'white', fontSize: '0.9rem'}}>
                                    Hello {user.email}
                                </span>

                            {user.role === 'admin' && (
                                <Link href={"/dashboard"} className="admin-link">
                                    Admin Panel
                                </Link>
                            )}
                            <button onClick={logout} style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>
                                Logout
                            </button>

                        </>
                    ) : (
                        <LoginForm/>
                    )}
                </li>
            </ul>
        </nav>
    );
}
