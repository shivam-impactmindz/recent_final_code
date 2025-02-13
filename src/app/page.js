// src\app\page.js

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function HomePage() {
    const router = useRouter();
    const [showLogin, setShowLogin] = useState(true);

    useEffect(() => {
        const shop = Cookies.get("shop");
        setShowLogin(!shop);
    }, []);

    const handleLogin = () => {
        router.push("/login");
    };

    return (
        <div className="home-container">
            <div className="hero">
                <h1 className="title">Welcome to Your Shopify App</h1>
                <p className="description">Manage your products with ease and efficiency.</p>
                {showLogin && (
                    <button onClick={handleLogin} className="login-button">Login to Get Started</button>
                )}
            </div>
        </div>
    );
}





// "use client"; // Mark this as a Client Component
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// export default function IndexPage() {
//     const [shop, setShop] = useState("");
//     const [error, setError] = useState("");
//     const router = useRouter(); // Get the router instance
//     const handleInstall = async () => {
//         if (!shop.trim()) {
//             setError("Please enter your Shopify store name.");
//             return;
//         }
//         setError("");
//         const shopName = shop.trim();
//         localStorage.setItem("shop", shopName);  // Store locally
//         // Use router.push to navigate without full page refresh
//         window.location.href=`/api/auth/?shop=${shopName}`;
//         // router.push(`/api/auth/?shop=${shopName}`);  // Go to auth endpoint
//     };
//     return (
//         <div className="index-container">
//             <h1>Install Your Shopify App</h1>
//             <input
//                 type="text"
//                 placeholder="your-store-name.myshopify.com"
//                 value={shop}
//                 onChange={(e) => setShop(e.target.value)}
//             />
//             <button onClick={handleInstall}>Install App</button>
//             {error && <p>{error}</p>}
//         </div>
//     );
// }