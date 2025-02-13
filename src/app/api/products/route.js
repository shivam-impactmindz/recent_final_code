// src/app/api/products/route.js
import { NextResponse } from "next/server"; // For sending JSON responses in Next.js
import { connectToDatabase } from "@/app/lib/database"; // Database connection function
import ShopModel from "@/app/models/session"; // Mongoose model to access shop session data
export async function GET(req) {
    try {
        await connectToDatabase();
        // Get the 'shop' parameter from the request URL query string
        const shop = req.nextUrl.searchParams.get("shop");
        if (!shop) {
            return NextResponse.json({ error: "Shop not found" }, { status: 400 });
        }
        // Query the database for the shop's data using the provided 'shop' value
        const shopData = await ShopModel.findOne({ shop });
        if (!shopData) {
            return NextResponse.json({ error: "Shop not registered" }, { status: 403 });
        }
        // Extract the accessToken from the shop data for authenticated Shopify API requests
        const accessToken = shopData.accessToken;
        // Shopify API call to fetch products
        const response = await fetch(
            `https://${shop}/admin/api/2025-01/products.json`, 
            {
                method: "GET",
                headers: {
                    "X-Shopify-Access-Token": accessToken,
                    "Content-Type": "application/json",
                },

            }
        );
        console.log('response1',response);
        if (!response.ok) {
            throw new Error("Failed to fetch products from Shopify","no products");
        }
        const { products } = await response.json();
        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


