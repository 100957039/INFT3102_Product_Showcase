import {useContext, useState} from "react";
import {CategoryContext} from "@/components/CategoryContext";
import {useRouter} from "next/router";

export default function PostFilter() {

    const {categories} = useContext(CategoryContext);
    const [selectedCategory, setSelectedCategory] = useState('');
    const router = useRouter();

    const handleFilter = () => {
        if (selectedCategory) {
            router.push(`/categories/${encodeURIComponent(selectedCategory)}`);
        }
    };


    return (
        <div className="post-filter">
            <h3>Filter Posts by Category</h3>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Select a Category</option>
                {
                    categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))
                }
            </select>
            <button onClick={handleFilter} disabled={!selectedCategory}>Filter</button>
        </div>
    )


}