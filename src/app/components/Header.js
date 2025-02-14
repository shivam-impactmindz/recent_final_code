// src\app\components\Header.js
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();
  const [hasShop, setHasShop] = useState(false);
  const [shop, setShop] = useState(""); // Store shop in state

  useEffect(() => {
    if (typeof window !== "undefined") {  // Check if running in browser
      const storedShop = localStorage.getItem("shop");
      if (storedShop) {
        setHasShop(true);
        setShop(storedShop); // Set shop state
      }
    }
  }, []);

  const handleProductsClick = async (e) => {
    e.preventDefault();  // Prevent default link behavior
    if (!shop) return router.push("/");

    // Call the verify-shop API
    const response = await fetch("/api/verify-shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shop }),
    });

    const data = await response.json();

    // If the shop is valid, redirect to the products page with the query params
    if (data.isValid) {
      router.push(`/products?shop=${shop}&hmac=${data.hmac}`); // Include the hmac and shop in query
    } else {
      router.push("/");
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">
          <Link href="/login">Next Shopify App</Link>
        </h1>
        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a href="#" onClick={handleProductsClick}>
                Products
              </a>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;





// "use client";
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// const Header = () => {
//   const router = useRouter();
//   const [hasShop, setHasShop] = useState(false);
//   useEffect(() => {
//     const shop = localStorage.getItem('shop');
//     if (shop) setHasShop(true);
//   }, []);
//   const handleProductsClick = async (e) => {
//     e.preventDefault();
//     const shop = localStorage.getItem('shop');
//     if (!shop) return router.push('/');
//     const response = await fetch('/api/verify-shop', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ shop }),
//     });
//     const data = await response.json();
//     router.push(data.isValid ? '/products' : '/');
//   };
//   return (
//     <header className="header">
//       <div className="header-container">
//         <h1 className="logo"><Link href="/">Next Shopify App</Link></h1>
//         <nav>
//           <ul className="nav-links">
//             {!hasShop && <li><Link href="/">Home</Link></li>}
//             <li><a href="/products" onClick={handleProductsClick}>Products</a></li>
//             <li><Link href="/about">About</Link></li>
//             <li><Link href="/contact">Contact</Link></li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// };
// export default Header;
