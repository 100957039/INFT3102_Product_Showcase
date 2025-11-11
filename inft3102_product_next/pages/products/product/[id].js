
import { PostContext } from "@/components/ProductContext.js";
import {useContext} from "react";
import {useRouter} from "next/router";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function PostDetail() {

    const { posts } = useContext(PostContext);
    const router = useRouter();
    const { id } = router.query;

    console.log('PostDetails: Router query ID', id);
    console.log('PostDetails: PostContext posts:', posts);

    const post = id ? posts.find(post => post.id === parseInt(id)) : null;

    return (
        <div className="app-container">
            <Header title="My Blog Platform" />
            <NavBar links={['Home', 'About', 'Blog']}/>
            <SideBar />
            <main className="content">
                <section className="card">
                    { post ? (
                        <div>
                            <h2>{post.title}</h2>
                            <p>By {post.author}</p>
                            <p>{post.content}</p>
                            {post.image && (
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    width={600}
                                    height={400}
                                    layout="responsive"
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            <p>Post Not Found (ID {id})</p>
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}