import {AuthContext} from "@/components/AuthContext";
import {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import Link from "next/link";

export default function AdminDashboard() {

    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect( () => {
        if(!loading){
            if(!user){
                router.push("/");
            }else if(user.role !== 'admin'){
                alert('Access denied! Admin Only');
                router.push("/");
            }
        }
    }, [user, loading, router]);


    if(loading) {
        return (
            <section className="cards">
                <p>Loading dashboard...</p>
            </section>
        );
    }

    if(!user || user.role !== 'admin'){
        return null;
    }

    return(
        <section className="card">
            <h1>Admin Dashboard</h1>
            <p>Welcome, <strong>{user.email}</strong>(Admin)</p>

            <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem'}}>
                <h3>Quick Actions</h3>
                <Link href="/products" style={{ width: '100%', textAlign: 'left' }}>
                    <button>View All Products</button>
                </Link>
            </div>
        </section>

    )





}

