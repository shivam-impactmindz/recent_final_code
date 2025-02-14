
// src\app\api\auth\route.js
import shopify from "@/app/lib/shopify";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req,res) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");
  if (!shop) {
    console.error("Shop parameter is missing");
    return NextResponse.json({ error: "Shop parameter is missing" }, { status: 400 });
  }
  try {
    // Convert Web API request into a Node.js-like request
    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: "/api/auth/callback",
      isOnline: false,
      rawRequest:req, // Fix: Convert headers
      rawResponse: res, // Fix: Pass a new NextResponse
    });
    console.log("auth route response:", authRoute);
    return authRoute;
  } catch (error) {
    console.error("Error starting auth for Shopify:", error);
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
  }
}


