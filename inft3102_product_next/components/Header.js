import Link from "next/link";

export default function Header( {title} ) {
    return (
        <header className="header">
            <h2>
                <Link href={`/`} className="no-link-style">
                    {title}
                </Link>
            </h2>

        </header>
    );
}
