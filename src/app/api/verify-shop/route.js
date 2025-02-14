// src/app/api/verify-shop/route.js
import { MongoClient } from "mongodb";
import crypto from "crypto";

const MONGO_URI = process.env.MONGO_URI;
const SECRET_KEY = process.env.SHOPIFY_SECRET_KEY;
let client = null;

async function getClient() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client;
}

export async function POST(req) {
  try {
    const { shop, hmac } = await req.json();

    // Generate HMAC
    const generatedHmac = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(shop)
      .digest('hex');

    // Compare HMAC
    if (generatedHmac !== hmac) {
      return Response.json({ isValid: false });
    }

    // Ensure MongoDB client is connected
    const client = await getClient();
    const database = client.db("shopifyapp");
    const sessions = database.collection("sessions");

    // Check if the shop exists in the database
    const session = await sessions.findOne({ shop });

    // If the shop exists, return isValid: true
    if (session) {
      return Response.json({ isValid: true });
    } else {
      // If the shop does not exist, return isValid: false
      return Response.json({ isValid: false });
    }
  } catch (error) {
    console.error("Error verifying shop:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




// // src/app/api/verify-shop/route.js
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