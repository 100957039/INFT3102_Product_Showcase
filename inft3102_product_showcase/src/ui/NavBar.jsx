import {Link} from "react-router-dom";

function NavBar( {links} ) {

    return (
        <nav className="navbar">
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
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