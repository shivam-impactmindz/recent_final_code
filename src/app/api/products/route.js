// src/app/api/products/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/database";
import ShopModel from "@/app/models/session";
export async function GET(req) {
    try {
        await connectToDatabase();
        const shop = req.nextUrl.searchParams.get("shop");
        if (!shop) {
            return NextResponse.json({ error: "Shop not found" }, { status: 400 });
        }
        const shopData = await ShopModel.findOne({ shop });
        if (!shopData) {
            return NextResponse.json({ error: "Shop not registered" }, { status: 403 });
        }
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
        if (!response.ok) {
            throw new Error("Failed to fetch products from Shopify");
        }
        const { products } = await response.json();
        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


