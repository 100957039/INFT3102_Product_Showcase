import { useContext } from "react";
import { PostContext } from "./ProductContext.js";
import Link from "next/link";

export default function PostList( {page, totalPosts, totalPages, onPageChange } ) {

    const { posts, setPosts } = useContext(PostContext)

    const handleRemove = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    }

    return (
        <div className="post-list">
            <h3>Blog Posts (Page {page} of {totalPages}, Total: {totalPosts})</h3>
            <ul>
                {posts.length === 0 ? (
                    <li>No posts found</li>
                ) : (
                     posts.map((post) => (
                        <li key={post.id}>
                            <Link href={`/blog/post/${post.id}`}>
                                <span>{post.title} by {post.author ? `by ${post.author}` : ''} (ID: {post.id})</span>
                            </Link>
                            <button onClick={() => handleRemove(post.id)}>Remove</button>
                        </li>
                    ))
                )}
            </ul>

            <div className="pagination">

                <button
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}>Previous
                </button>

                <span>Page {page} of {totalPages}</span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}>Next
                </button>

            </div>

        </div>
    );

}
