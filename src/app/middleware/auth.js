// src/middleware/auth.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/database";
import Session from "@/app/models/session";

export async function middleware(req) {
  const shop = req.cookies.get("shop")?.value;
  if (!shop) {
    return NextResponse.redirect("/login"); // Redirect to login if no shop in cookies
  }

  // Connect to database and verify session
  await connectToDatabase();
  const session = await Session.findOne({ shop });

  if (!session || !session.accessToken) {
    return NextResponse.redirect("/login"); // Redirect if session not valid
  }

  return NextResponse.next(); // Proceed if session is valid
}

export const config = {
  matcher: ["/products", "/about", "/contact"],
};
