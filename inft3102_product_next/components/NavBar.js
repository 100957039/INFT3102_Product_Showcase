import Link from "next/link";
import {useRouter} from "next/router";

export default function NavBar({ links }) {
    const router = useRouter();
    const { pathname } = router || {};

    return (
        <nav className="navbar" aria-label="Main Navigation">
            <ul>
                {links.map((link, index) => {
                    const href = link === 'Home' ? '/' : `/${link.toLowerCase()}`;
                    const isActive = pathname === href || (link === 'Products' && pathname.startsWith('/products'));

                    return (
                        <li key={index}>
                            <Link
                                href={href}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {link}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
