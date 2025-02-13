// src\app\api\auth\verify-session\route.js
import { verifySession } from "@/app/lib/auth"
import { NextResponse } from 'next/server';
export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const shop = searchParams.get('shop');
    if (!shop) {
        return NextResponse.json({ authenticated: false }, { status: 400 });
    }
    try {
        const isAuthenticated = await verifySession(shop);
        return NextResponse.json({ authenticated: !!isAuthenticated });
    } catch (error) {
        console.error("Error during authentication:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}