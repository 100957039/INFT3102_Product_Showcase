import {VendContext} from "@/components/VendContext";
import {useContext, useEffect} from "react";
import {useRouter} from "next/router";
import Link from "next/link";

export default function AdminDashboard() {

    const { user, loading } = useContext(VendContext);
    const router = useRouter();

    //Redirect non-admins or unauthenticated users
    useEffect( () => {
        if(!loading){
            if(!user){
                router.push("/");     //redirect user to home if not logged in
            }else if(user.role !== 'admin'){
                alert('Access denied! Admin Only');
                router.push("/");     //redirect user to home if not logged in
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
                <Link href="/blog" style={{ width: '100%', textAlign: 'left' }}>
                    <button>View All Posts</button>
                </Link>

                {/* Future Expansion */}
                <button disabled style={{ opacity: 0.5}}>Manage User  (Coming Soon - Possibly in 12.2)</button>
                <button disabled style={{ opacity: 0.5}}>Site Setting (Coming Soon - Possibly in 13.1)</button>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', fontSize: '0.9rem' }}>
                <p><strong>Admin Tips:</strong></p>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
                    <li>You can edit or delete <strong>any</strong> post from the blog pages</li>
                    <li>Authors can only edit/delete their own posts</li>
                    <li>All actions  are secured with JWT (JSON Web Tokens) + RBAC</li>
                </ul>
            </div>

        </section>

    )





}

