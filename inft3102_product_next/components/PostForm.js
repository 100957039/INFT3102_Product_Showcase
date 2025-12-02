import {useContext, useState} from 'react';
import {useRouter} from "next/router";
import {CategoryContext} from "@/components/CategoryContext.js";

export default function PostForm() {


    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('Tech');
    const { categories } = useContext(CategoryContext);
    const router = useRouter();

    // Event Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title && body && author && category) {
            try{
                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({title, body, author, category}),
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(errText || 'Failed to create post');
                }

                setTitle('');
                setBody('');
                setAuthor('');
                setCategory('Tech');

                router.push('/blog');

            } catch(err) {
                console.error('Error submitting post', err.message);
                alert('Failed to create post: ' + err.message);
            }
        }
    };

    return (

        <div className="post-form">
            <form className="post-form" onSubmit={handleSubmit}>
                <h3>Create a Blog Post</h3>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Enter Post Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="Post Title"
                />

                <input
                    type="text"
                    placeholder="Enter Post Body"
                    onChange={(e) => setBody(e.target.value)}
                    aria-label="Post Body"
                />

                <input
                    type="text"
                    placeholder="Enter Post Author"
                    onChange={(e) => setAuthor(e.target.value)}
                    aria-label="Post Author"
                />

                <button type="submit">Save Post</button>
            </form>
        </div>
    );
}