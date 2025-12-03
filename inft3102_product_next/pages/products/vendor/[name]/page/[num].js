import {PostContext} from "@/components/PostContext";
import {useContext, useEffect} from "react";
import PostList from "@/components/PostList";

export default function AuthorPage( {posts, author, page}) {

    const {setPosts} = useContext(PostContext);

    // This runs only in the browser
    // We populate global context so other components (like filters) can access posts
    useEffect( () => {
        if(posts) setPosts(posts);
    },  [posts, setPosts]);

    return (
        <section className="card">
            <h1>Posts by {author} - Page {page}</h1>
            <PostList
                posts={posts}
                page={page}
                totalPosts={posts.length}
                totalPages={1}
            />
        </section>
    );
}

// This is where SSR + Nested Routing Happens
// getServerSideProps = run on every request
// This makes it Server-Side Rendered (SSR)
export async function getServerSideProps( {params} ){

    const {name} = params;
    const res = await
        fetch(`http://localhost:3000/api/posts?author=${encodeURIComponent(name)}`);

    const posts = await res.json();
    return {
        props: {
            posts,
            author: name,
            page: '1'
        }
    }


}