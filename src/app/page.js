// src\app\page.js
import { redirect } from "next/navigation";

export default function HomePage() {
    redirect("/login"); // Redirects to the login page
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