import {Link} from "react-router-dom";

function NavBar( {links} ) {

    return (
        <nav className="navbar">
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        {/* Replace <a> with Link (React Router) for SPA/Client-Side Navigation */}
                        <Link to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                              aria-current={link === 'Home' ? 'page' : undefined}>
                            {link}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBar;