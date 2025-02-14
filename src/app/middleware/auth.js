// src/middleware/auth.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/database";
import Session from "@/app/models/session";
import crypto from "crypto";

const SECRET_KEY = process.env.SHOPIFY_SECRET_KEY;

export async function middleware(req) {
  const shop = req.cookies.get("shop")?.value;
  const url = new URL(req.url);
  const hmac = url.searchParams.get("hmac");

  if (!shop || !hmac) {
    return NextResponse.redirect("/login");
  }

  // Generate HMAC
  const generatedHmac = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(shop)
    .digest('hex');

  // Compare HMAC
  if (generatedHmac !== hmac) {
    return NextResponse.redirect("/login");
  }

  // Connect to database and verify session
  await connectToDatabase();
  const session = await Session.findOne({ shop });
  if (!session || !session.accessToken) {
    return NextResponse.redirect("/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products", "/about", "/contact"],
};








// // src/middleware/auth.js
// import { NextResponse } from "next/server";
// import connectToDatabase from "@/app/lib/database";
// import Session from "@/app/models/session";

// export async function middleware(req) {
//   const shop = req.cookies.get("shop")?.value;
//   if (!shop) {
//     return NextResponse.redirect("/login"); // Redirect to login if no shop in cookies
//   }

//   // Connect to database and verify session
//   await connectToDatabase();
//   const session = await Session.findOne({ shop });

//   if (!session || !session.accessToken) {
//     return NextResponse.redirect("/login"); // Redirect if session not valid
//   }

//   return NextResponse.next(); // Proceed if session is valid
// }

// export const config = {
//   matcher: ["/products", "/about", "/contact"],
// };
