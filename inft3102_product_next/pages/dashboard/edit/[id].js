import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/components/AuthContext";
import {CategoryContext} from "@/components/CategoryContext";
import {useRouter} from "next/router";

export default function EditPost() {

    const {user, loading} = useContext(AuthContext);
    const {categories} = useContext(CategoryContext);
    const router = useRouter();
    const id = router.query;

    const [post, setPost] = useState(null)
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id || loading) return;
        if (!user) {
            router.push('/')
            return;
        }

        const fetchPost = async () => {
            try {
                const response = await fetch('/api/posts');
                const posts = await response.json();
                const found = posts.find(p => p.id === id);

                if (!found) {
                    setError('Post not found');
                    return;
                }

                if (found.author !== user.email && user.role !== 'admin') {
                    setError('You can only edit your own posts')
                    return;
                }

                setPost(found);
                setTitle(found.title);
                setBody(found.body);
                setAuthor(found.author);
                setCategory(found.category);
            } catch (err) {
                setError('Failed to load Post');
            }

        };

        fetchPost();

    }, [id, user, loading, router, categories]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title || !body) return setError('Title and body are required');

        setSaving(true);
        setError('');

        try{
            const response = await fetch(`/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    body: JSON.stringify({id, title, body, author, category}),
                }
            });

            if(response.ok){
                router.push('/blog');
            }else{
                const data = await response.json();
                setError(data.error || 'Failed to Update Post');
            }

        }catch(err){
            setError('Network Issue. Failed to Update Post');
        }finally{
            setSaving(false);
        }
    };

    if(loading) return <p>Loading...</p>
    if(error) return <section className="card"><p> style={{color: 'red'}}</p>{error}</section>
    if(!post) return <p>Loading Post...</p>

    return (
        <section className="card">
            <h1>Edit Post</h1>
            <form onSubmit={handleSubmit} className="post-form">

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required/>

                <textarea
                    placeholder="Content"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={10}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                />

                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    readOnly
                    style={{ background: '#f5f5f5'}}/>

                <select value={category} onChange={e => setCategory(e.target.value)}>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <button type="submit" disabled={saving}>
                    {saving ? 'Saving' : 'Update Post'}
                </button>

            </form>
        </section>

    );



}