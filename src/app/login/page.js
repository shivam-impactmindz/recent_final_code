// src/app/login/page.js
"use client";
import { useState, useEffect } from "react"; // <-- Import useEffect and useState from React
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function LoginPage() {
    const [shop, setShop] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const shopFromCookies = Cookies.get("shop");
            if (shopFromCookies) {
                // If shop exists in cookies, verify it with MongoDB
                try {
                    const response = await fetch("/api/verify-shop", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ shop: shopFromCookies }),
                    });
                    const data = await response.json();
                    if (data.isValid) {
                        router.push(`/products?shop=${shopFromCookies}`); // Redirect to products if valid
                    }
                } catch (error) {
                    console.error("Error verifying shop:", error);
                }
            }
        };

        checkSession();
    }, [router]);

    const handleLogin = async () => {
        if (!shop.trim() || !password.trim()) {
            setError("Please enter both store name and password.");
            return;
        }
        setError("");
        const expiresInDays = 7; // Cookie expiry in days
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expiresInDays);
        localStorage.setItem("shop", shop.trim());
        localStorage.setItem("password", password.trim());
        // Set cookies with expiry of 7 days
        Cookies.set("shop", shop.trim(), { expires: expiresInDays });
        Cookies.set("password", password.trim(), { expires: expiresInDays });
        window.location.href = `/api/auth/?shop=${shop.trim()}`;
    };
    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Login to Your Shopify App</h1>
                <input
                    type="text"
                    placeholder="your-store-name.myshopify.com"
                    value={shop}
                    onChange={(e) => setShop(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}
