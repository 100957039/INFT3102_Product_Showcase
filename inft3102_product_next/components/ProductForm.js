import {useContext, useState} from 'react';
import {useRouter} from "next/router";
import {CategoryContext} from "@/components/CategoryContext.js";

export default function ProductForm() {


    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [vendor, setVendor] = useState('');
    const [category, setCategory] = useState('Fruit');
    const { categories } = useContext(CategoryContext);
    const router = useRouter();

    // Event Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name && price && description && vendor && category) {
            try{
                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    description: JSON.stringify({name, price, description, vendor, category}),
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(errText || 'Failed to create product');
                }

                setName('');
                setPrice('');
                setDescription('');
                setVendor('');
                setCategory('Fruit');

                router.push('/products');

            } catch(err) {
                console.error('Error submitting product', err.message);
                alert('Failed to create product: ' + err.message);
            }
        }
    };

    return (

        <div className="product-form">
            <form className="product-form" onSubmit={handleSubmit}>
                <h3>Create a Product</h3>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Enter Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="Product Name"
                />

                <input
                    type="number"
                    placeholder="Enter Product Price"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    aria-label="Product Price"
                />

                <input
                    type="text"
                    placeholder="Enter Product Description"
                    onChange={(e) => setDescription(e.target.value)}
                    aria-label="Product Description"
                />

                <input
                    type="text"
                    placeholder="Enter Product Vendor"
                    onChange={(e) => setVendor(e.target.value)}
                    aria-label="Product Vendor"
                />

                <button type="submit">Save Product</button>
            </form>
        </div>
    );
}