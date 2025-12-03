import Link from "next/link";

export default function SideBar() {
    return (
        <aside className="sidebar">
            <h3>Quick Links</h3>
            <ul>
                <li>
                    <Link href={`/about`}>About</Link>
                </li>
                <li>
                    <Link href={`/products`}>Products</Link>
                </li>
            </ul>
        </aside>
    );
}
