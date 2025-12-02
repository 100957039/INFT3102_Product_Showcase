import {PostContext} from "@/components/PostContext";
import {useContext, useEffect} from "react";
import PostFilter from "@/components/PostFilter";
import PostList from "@/components/PostList";

export default function CategoryPage( {posts, error, category, page, totalPosts, totalPages} ) {

    const {setPost} = useContext(PostContext);

    useEffect(() => {
        if(posts) setPost(posts);
    },  [posts, setPosts])


    return (
        <div className="content">
            <section className="card">
                <h1>Posts in {category}</h1>
                <PostFilter />
                {error ? (
                    <p role="alert">{error}</p>
                    ) : (
                        <PostList page={page} totalPosts={totalPosts} totalPages={totalPages} />
                    )
                }
            </section>
        </div>
    )
}

export async function getServerSideProps({params, query}) {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const envId = process.env.CONTENTFUL_ENV || 'master';
    const contentType = 'post';
    const limit = 5;
    const page = parseInt(query.page || '1', 10);
    const skip = (page - 1) * limit;
    const category = params.category;

    const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries?content_type=${contentType}&access_token=${accessToken}&limit=${limit}&skip=${skip}&fields.categories=${encodeURIComponent(category)}`;

    try{
        console.log('Fetching posts from Contentful for category', category);
        const response = await fetch(url);

        if(!response.ok){
            console.log('Failed to fetch posts from Contentful for category', category);
            throw new Error('Failed to fetch Contentful posts for category');
        }
        const data = await response.json();
        const posts = (data.items || []).map((item) => (
            {
                id: item.sys.id,
                title: item.fields.title,
                content: item.fields.body,
                author: item.fields.author,
                category: item.fields.category,
                image: item.fields.image?.fields?.file?.url || null
            }
        ));
        const totalPosts = data.total || 0;
        const totalPages = Math.ceil(totalPosts / limit);

        return {
            props: {
                posts,
                error: null,
                category,
                page,
                totalPosts,
                totalPages
            }
        };

    } catch(error){
        console.error('Error fetching posts from Contentful for category', error.message);

        return {
            props: {
                posts: [],
                error: 'Failed to fetch posts from Contentful for category: ' + error.message + '',
                category,
                page: 1,
                totalPosts: 0,
                totalPages: 1
            }
        };
    }
}