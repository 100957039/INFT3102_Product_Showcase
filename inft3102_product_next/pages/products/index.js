import PostList from "@/components/PostList.js";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import Footer from "@/components/Footer";
import {useContext, useEffect} from "react";
import {PostContext} from "@/components/PostContext";
import {useRouter} from "next/router";

function Blog( {posts, error, page, totalPosts, totalPages} ) {

    const {setPosts} = useContext(PostContext);
    const router = useRouter();

    useEffect(() => {
        if(posts) setPosts(posts);
    }, [posts, setPosts]);

    const handlePageChange = (newPage) => {
        router.push(`/blog?page=${newPage}`);
    }

    return (
        <div className="app-container">
            <Header title="My Blog Platform" />
            <NavBar links={['Home', 'About', 'Blog']}/>
            <SideBar />
            <main className="content">
                <section className="card">
                    <h1>Blog Posts</h1>
                    { error ? (
                        <p role="alert">{error}</p>
                    ) : (
                        <PostList
                            page={page}
                            totalPosts={totalPosts}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </section>
            </main>
            <Footer />

        </div>
    );
}

export async function getServerSideProps( {query} ) {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || 'master';
    const contentType = 'post';
    const limit = 5;
    const page = parseInt(query.page || '1', 10);
    const skip = (page - 1) * limit;

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}&limit=${limit}&skip=${skip}`;

    try {
        console.log('Fetching posts from Contentful');

        const response = await fetch(url);

        if (!response.ok) {
            console.log('Failed to fetch Contentful posts', response.status, response.statusText);
            throw new Error('Failed to fetch Contentful posts');
        }

        const data = await response.json();
        console.log('Contentful API response', data);
        if(!data.items || data.items.length === 0){
            console.error('No published post found in Contentful response');
            throw new Error('No published post found in Contentful response');
        }

        const posts = data.items.slice(0, 5).map((item) => ({
            id: item.sys.id,
            title: item.fields.title,
            content: item.fields.body,
            author: item.fields.author,
            image: item.fields.image?.fields?.file?.url || null
        }));

        const totalPosts = data.total || 0;
        const totalPages = Math.ceil(totalPosts / limit);

        return {
            props:{
                posts,
                error: null,
                page,
                totalPosts,
                totalPages
            }
        };

    } catch(err){
        console.error('Error in getServerSideProps()', err.message);
        return {
            props:{
                posts: [],
                error: 'Failed to fetch posts: ' + err.message,
                page: 1,
                totalPosts: 0,
                totalPages: 1
            }
        };
    }
}

export default Blog;