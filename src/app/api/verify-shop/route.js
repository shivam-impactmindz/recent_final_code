// src/app/api/verify-shop/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);

export async function POST(req) {
  const { shop } = await req.json();

  if (!shop) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }

  try {
    await client.connect();
    const database = client.db("shopifyapp");
    const sessions = database.collection("sessions");

    const existingShop = await sessions.findOne({ shop });

    return NextResponse.json({ isValid: !!existingShop }, { status: 200 });
  } catch (error) {
    console.error("Error verifying shop:", error);
    return NextResponse.json({ isValid: false }, { status: 500 });
  } finally {
    await client.close();
  }
}

// import { MongoClient } from "mongodb";
// const MONGO_URI = process.env.MONGO_URI;
// let client = null;
// async function getClient() {
//   if (!client) {
//     client = new MongoClient(MONGO_URI);
//     await client.connect();
//   }
//   return client;
// }
// export async function POST(req) {
//   try {
//     const { shop } = await req.json();
//     // Ensure MongoDB client is connected
//     const client = await getClient();
//     const database = client.db("shopifyapp");
//     const sessions = database.collection("sessions");
//     // Check if the shop exists in the database
//     const session = await sessions.findOne({ shop });
//     // If the shop exists, return isValid: true
//     if (session) {
//       return Response.json({ isValid: true });
//     } else {
//       // If the shop does not exist, return isValid: false
//       return Response.json({ isValid: false });
//     }
//   } catch (error) {
//     console.error("Error verifying shop:", error);
//     return Response.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


// import { MongoClient } from "mongodb";
// const MONGO_URI = process.env.MONGO_URI;
// const client = new MongoClient(MONGO_URI);
// export async function POST(req) {
//   try {
//     const { shop } = await req.json();
//     // Connect to MongoDB
//     await client.connect();
//     const database = client.db("shopifyapp");
//     const sessions = database.collection("sessions");
//     // Check if the shop exists in the database
//     const session = await sessions.findOne({ shop });
//     // If the shop exists, return isValid: true
//     if (session) {
//       return Response.json({ isValid: true });
//     } else {
//       // If the shop does not exist, return isValid: false
//       return Response.json({ isValid: false });
//     }
//   } catch (error) {
//     console.error("Error verifying shop:", error);
//     return Response.json({ error: "Internal Server Error" }, { status: 500 });
//   } finally {
//     await client.close();
//   }
// }