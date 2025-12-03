import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/components/AuthContext";
import {CategoryContext} from "@/components/CategoryContext";
import {useRouter} from "next/router";

export default function EditProduct() {

    const {user, loading} = useContext(AuthContext);
    const {categories} = useContext(CategoryContext);
    const router = useRouter();
    const id = router.query;

    const [product, setProduct] = useState(null)
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [vendor, setVendor] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id || loading) return;
        if (!user) {
            router.push('/')
            return;
        }

        const fetchProduct = async () => {
            try {
                const response = await fetch('/api/products');
                const products = await response.json();
                const found = products.find(p => p.id === id);

                if (!found) {
                    setError('Product not found');
                    return;
                }

                if (found.vendor !== user.email && user.role !== 'admin') {
                    setError('You can only edit your own products')
                    return;
                }

                setProduct(found);
                setName(found.name);
                setPrice(found.price);
                setDescription(found.description);
                setVendor(found.vendor);
                setCategory(found.category);
            } catch (err) {
                setError('Failed to load Product');
            }

        };

        fetchProduct();

    }, [id, user, loading, router, categories]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!name || !price || !description) return setError('Name, price, and description are required');

        setSaving(true);
        setError('');

        try{
            const response = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    body: JSON.stringify({id, name, price, description, vendor, category}),
                }
            });

            if(response.ok){
                router.push('/products');
            }else{
                const data = await response.json();
                setError(data.error || 'Failed to Update Product');
            }

        }catch(err){
            setError('Network Issue. Failed to Update Product');
        }finally{
            setSaving(false);
        }
    };

    if(loading) return <p>Loading...</p>
    if(error) return <section className="card"><p> style={{color: 'red'}}</p>{error}</section>
    if(!product) return <p>Loading Product...</p>

    return (
        <section className="card">
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit} className="product-form">

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={10}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)' }}
                />

                <input
                    type="text"
                    placeholder="Vendor"
                    value={vendor}
                    onChange={e => setVendor(e.target.value)}
                    readOnly
                    style={{ background: '#f5f5f5'}}/>

                <select value={category} onChange={e => setCategory(e.target.value)}>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <button type="submit" disabled={saving}>
                    {saving ? 'Saving' : 'Update Product'}
                </button>

            </form>
        </section>

    );



}