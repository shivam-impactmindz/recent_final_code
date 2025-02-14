// src/app/api/auth/callback/route.js
import shopify from "@/app/lib/shopify";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import crypto from "crypto";

const MONGO_URI = process.env.MONGO_URI;
const SECRET_KEY = process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET;
const client = new MongoClient(MONGO_URI);

export async function GET(req, res) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { session } = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    console.log("Session received:", session);

    // Check for necessary session fields
    if (!session?.shop || !session?.accessToken) {
      throw new Error("Session missing required fields (shop, accessToken)");
    }

    // ✅ Connect to MongoDB
    await client.connect();
    const database = client.db("shopifyapp");
    const sessions = database.collection("sessions");

    // ✅ Extract session data
    const { shop, accessToken, scope, isOnline, expires } = session;
    const sessionData = {
      shop,
      accessToken,
      scope,
      isOnline,
      expires,
      createdAt: new Date(),
    };

    // ✅ Upsert session into MongoDB
    await sessions.updateOne(
      { shop },
      { $set: sessionData },
      { upsert: true }
    );
    console.log("✅ Session saved successfully:", sessionData);

    // Set shop in cookies
    cookies().set("shop", shop, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  // Secure cookie in production
      maxAge: 60 * 60 * 24 * 7,  // 1 week
    });

    // Generate HMAC
    const hmac = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(shop)
      .digest('hex');

    // ✅ Redirect to Products page with necessary params
    const { searchParams } = new URL(req.url);
    const host = searchParams.get("host");
    const hostWithoutProtocol = process.env.NEXT_PUBLIC_HOST.replace(/^https?:\/\//, '');
    const redirectUrl = `https://${hostWithoutProtocol}/products?host=${host}&shop=${session.shop}&hmac=${hmac}`;
    console.log("🔹 Redirecting to:", redirectUrl);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("❌ Error during OAuth callback:", error);
    return NextResponse.json(
      { error: "Authentication failed", details: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}


// // src/app/api/auth/callback/route.js
// import shopify from "@/app/lib/shopify";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import { MongoClient } from "mongodb";
// import crypto from "crypto";

// const MONGO_URI = process.env.MONGO_URI;
// const SECRET_KEY = process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET;
// const client = new MongoClient(MONGO_URI);

// export async function GET(req, res) {
//   if (req.method !== "GET") {
//     return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
//   }

//   try {
//     const { session } = await shopify.auth.callback({
//       rawRequest: req,
//       rawResponse: res,
//     });

//     console.log("Session received:", session);

//     if (!session?.shop || !session?.accessToken) {
//       throw new Error("Session missing required fields (shop, accessToken)");
//     }

//     // ✅ Connect to MongoDB
//     await client.connect();
//     const database = client.db("shopifyapp");
//     const sessions = database.collection("sessions");

//     // ✅ Extract session data
//     const { shop, accessToken, scope, isOnline, expires } = session;
//     const sessionData = {
//       shop,
//       accessToken,
//       scope,
//       isOnline,
//       expires,
//       createdAt: new Date(),
//     };

//     // ✅ Upsert session into MongoDB
//     await sessions.updateOne(
//       { shop },
//       { $set: sessionData },
//       { upsert: true }
//     );
//     console.log("✅ Session saved successfully:", sessionData);
    
//     // // Set shop in cookies
//     // cookies().set("shop", session.shop, {
//     //   httpOnly: true,
//     //   secure: process.env.NODE_ENV === "production",  // Secure cookie in production
//     //   maxAge: 60 * 60 * 24 * 7,  // 1 week
//     // });

//     // Generate HMAC
//     const hmac = crypto
//       .createHmac('sha256', SECRET_KEY)
//       .update(shop)
//       .digest('hex');

//     // ✅ Redirect to Products page with necessary params
//     const { searchParams } = new URL(req.url);
//     const host = searchParams.get("host");
//     const hostWithoutProtocol = process.env.NEXT_PUBLIC_HOST.replace(/^https?:\/\//, '');
//     const redirectUrl = `https://${hostWithoutProtocol}/products?host=${host}&shop=${session.shop}&hmac=${hmac}`;
//     console.log("🔹 Redirecting to:", redirectUrl);

//     return NextResponse.redirect(redirectUrl);
//   } catch (error) {
//     console.error("❌ Error during OAuth callback:", error);
//     return NextResponse.json(
//       { error: "Authentication failed", details: error.message },
//       { status: 500 }
//     );
//   } finally {
//     await client.close();
//   }
// }




// // src\app\api\auth\callback\route.js
// import shopify from "@/app/lib/shopify";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// import { MongoClient } from "mongodb";
// const MONGO_URI = process.env.MONGO_URI;
// const client = new MongoClient(MONGO_URI);
// export async function GET(req, res) {
//   if (req.method !== "GET") {
//     return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
//   }
//   try {
//     const { session } = await shopify.auth.callback({
//       rawRequest: req,
//       rawResponse: res,
//     });
//     console.log("Session received:", session);
//     if (!session?.shop || !session?.accessToken) {
//       throw new Error("Session missing required fields (shop, accessToken)");
//     }
//     // ✅ Connect to MongoDB
//     await client.connect();
//     const database = client.db("shopifyapp");
//     const sessions = database.collection("sessions");
//     // ✅ Extract session data
//     const { shop, accessToken, scope, isOnline, expires } = session;
//     const sessionData = {
//       shop,
//       accessToken,
//       scope,
//       isOnline,
//       expires,
//       createdAt: new Date(),
//     };
//     // ✅ Upsert session into MongoDB
//     const existingShop = await sessions.findOne({ shop });
//     if (existingShop) {
//       console.log(`Shop ${shop} already exists. Skipping session creation.`);
//     } else {
//       // ✅ Upsert session into MongoDB if shop doesn't exist
//       await sessions.insertOne(sessionData);
//       console.log("✅ Session saved successfully:", sessionData);
//     }
//     // ✅ Redirect to About page with necessary params
//     const { searchParams } = new URL(req.url);
//     const host = searchParams.get("host");
//     // Ensure NEXT_PUBLIC_HOST does not include the protocol
//     const hostWithoutProtocol = process.env.NEXT_PUBLIC_HOST.replace(/^https?:\/\//, '');
//     const redirectUrl = `https://${hostWithoutProtocol}/products?host=${host}&shop=${session.shop}`;
//     console.log("🔹 Redirecting to:", redirectUrl);
//     return NextResponse.redirect(redirectUrl);
//   } catch (error) {
//     console.error("❌ Error during OAuth callback:", error);
//     return NextResponse.json(
//       { error: "Authentication failed", details: error.message },
//       { status: 500 }
//     );
//   } finally {
//     await client.close();
//   }
// }