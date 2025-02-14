// src/app/products/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import crypto from "crypto";
import "@/app/styles/products.css";

const SECRET_KEY = process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET;

export default function ProductsPage() {
  const [isValidShop, setIsValidShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const verifyShopAndFetchProducts = async () => {
      const shop = Cookies.get("shop");
      const hmac = new URL(window.location.href).searchParams.get("hmac");

      if (!shop || !hmac) {
        router.replace("/login");
        return;
      }

      // Generate HMAC on the client side to match the middleware logic
      const generatedHmac = crypto.createHmac("sha256", SECRET_KEY).update(shop).digest("hex");

      if (generatedHmac !== hmac) {
        console.error("HMAC mismatch: Invalid shop credentials");
        router.replace("/login");
        return;
      }

      try {
        const verifyResponse = await fetch("/api/verify-shop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shop, hmac }),
        });

        const verifyData = await verifyResponse.json();
        if (!verifyData.isValid) {
          setIsValidShop(false);
          router.replace("/");
          return;
        }

        setIsValidShop(true);

        // Fetch products if the shop is valid
        const productsResponse = await fetch('/api/products?shop=${shop}');
        const productsData = await productsResponse.json();

        if (productsData.products) {
          setProducts(productsData.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error verifying shop or fetching products:", error);
        setIsValidShop(false);
      } finally {
        setLoading(false);
      }
    };

    verifyShopAndFetchProducts();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (isValidShop === false) return <p>Shop validation failed. Redirecting...</p>;

  return (
    <div className="products-container">
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image?.src || "/placeholder.jpg"}
                alt={product.title}
                className="product-image"
              />
              <div className="product-info">
                <p className="product-title">{product.title}</p>
                <p className="product-price">
                  ₹{product.variants[0]?.price || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// // src/app/products/page.js
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import "@/app/styles/products.css";
// export default function ProductsPage() {
//   const [isValidShop, setIsValidShop] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]);
//   const router = useRouter();
//   useEffect(() => {
//     const verifyShopAndFetchProducts = async () => {
//       const shop = Cookies.get("shop");
//       const hmac = new URL(window.location.href).searchParams.get("hmac");
//       if (!shop || !hmac) {
//         router.replace("/login");
//         return;
//       }
//       try {
//         const verifyResponse = await fetch("/api/verify-shop", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ shop, hmac }),
//         });
//         const verifyData = await verifyResponse.json();
        
//         if (!verifyData.isValid) {
//           setIsValidShop(false);  // Set to false if verification fails
//           router.replace("/");     // Redirect to home if shop is invalid
//           return;
//         }
//         setIsValidShop(true);  // Set to true if shop is valid
//         // Fetch products
//         const productsResponse = await fetch(`/api/products?shop=${shop}`);
//         const productsData = await productsResponse.json();
//         if (productsData.products) {
//           setProducts(productsData.products);  // Populate products if available
//         } else {
//           setProducts([]);  // Ensure an empty array if no products are returned
//         }
//       } catch (error) {
//         console.error("Error verifying shop or fetching products:", error);
//         setIsValidShop(false);  // If there's an error, mark the shop as invalid
//       } finally {
//         setLoading(false);  // Stop loading once the process is complete
//       }
//     };
//     verifyShopAndFetchProducts();
//   }, [router]);

//   if (loading) return <p>Loading...</p>;
//   if (isValidShop === false) return <p>Shop validation failed. Redirecting...</p>;
//   return (
//     <div className="products-container">
//       <h1>Products</h1>
//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <div className="products-grid">
//           {products.map((product) => (
//             <div key={product.id} className="product-card">
//               <img
//                 src={product.image?.src || "/placeholder.jpg"}
//                 alt={product.title}
//                 className="product-image"
//               />
//               <div className="product-info">
//                 <p className="product-title">{product.title}</p>
//                 <p className="product-price">
//                   ₹{product.variants[0]?.price || "N/A"}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// // src\app\products\page.js
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import "@/app/styles/products.css"; // ✅ Correct import for global CSS

// export default function ProductsPage() {
//   const [isValidShop, setIsValidShop] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]); // ✅ Products ke liye state
//   const router = useRouter();

//   useEffect(() => {
//     const verifyShopAndFetchProducts = async () => {
//       const shop = Cookies.get("shop");

//       if (!shop) {
//         router.replace("/");
//         return;
//       }

//       try {
//         const verifyResponse = await fetch("/api/verify-shop", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ shop }),
//         });

//         const verifyData = await verifyResponse.json();

//         if (!verifyData.isValid) {
//           setIsValidShop(false);
//           router.replace("/");
//           return;
//         }

//         setIsValidShop(true);

//         // ✅ Fetch products from API
//         const productsResponse = await fetch(`/api/products?shop=${shop}`);
//         const productsData = await productsResponse.json();
//        console.log("productsResponse", productsResponse);
//        console.log("productsData", productsData);
//         if (productsData.products) {
//           setProducts(productsData.products);
//         }

//       } catch (error) {
//         console.error("Error verifying shop or fetching products:", error);
        
//         setIsValidShop(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyShopAndFetchProducts();
//   }, [router]);

//   if (loading) return <p>Loading...</p>;

//   if (isValidShop === false) {
//     return null;
//   }

//   return (
//     <div className="products-container"> {/* ✅ Use global class names */}
//       <h1>Products</h1>
//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <div className="products-grid">
//           {products.map((product) => (
//             <div key={product.id} className="product-card">
//               <img
//                 src={product.image?.src || "/placeholder.jpg"}
//                 alt={product.title}
//                 className="product-image"
//               />
//               <div className="product-info">
//                 <p className="product-title">{product.title}</p>
//                 <p className="product-price">
//                   ₹{product.variants[0]?.price || "N/A"}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }








// "use client"; // Mark this as a Client Component
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
// export default function ProductsPage() {
//   const [isValidShop, setIsValidShop] = useState(false);
//   const router = useRouter();
//   useEffect(() => {
//     const verifyShop = async () => {
//       // Retrieve the shop value from localStorage
//       const shop = localStorage.getItem("shop");
//       // If no shop value is found, redirect to the home page
//       if (!shop) {
//         router.push("/");
//         return;
//       }
//       try {
//         // Verify the shop against the MongoDB database
//         const response = await fetch("/api/verify-shop", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ shop }),
//         });
//         const data = await response.json();
//         // If the shop is valid, allow access to the products page
//         if (data.isValid) {
//           setIsValidShop(true);
//         } else {
//           // If the shop is invalid, redirect to the home page
//           router.push("/");
//         }
//       } catch (error) {
//         console.error("Error verifying shop:", error);
//         router.push("/");
//       }
//     };
//     verifyShop();
//   }, [router]);
//   // Prevent rendering until verification is complete
//   if (!isValidShop) {
//     return null;
//   }
//   return (
//     <div className="products-container">
//       <h1>Products</h1>
//       <p>Welcome to the products page! Here you can manage your Shopify products.</p>
//     </div>
//   );
// }