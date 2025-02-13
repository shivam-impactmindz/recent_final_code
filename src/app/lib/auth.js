// src\app\utils\auth.js
// import connectToDatabase from "@/app/lib/database";
import { connectToDatabase } from "@/app/lib/database";
import Session from "@/app/models/session";
export async function verifySession(shop) {
    await connectToDatabase();
    const session = await Session.findOne({ shop });
    return session ? session.accessToken : null;
}