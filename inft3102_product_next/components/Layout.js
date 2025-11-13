import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import Footer from "@/components/Footer";

export default function Layout({children}) {
    return(
        <div className="app-container">
            <Header title="Product Showcase" />
            <NavBar links={['Home', 'About', 'Products']} />
            <SideBar />
            <main className="content">{children}</main>
            <Footer />
        </div>
    );

}