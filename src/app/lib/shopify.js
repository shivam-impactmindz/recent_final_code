// src\app\utils\shopify.js
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/web-api"; // ✅ Required for Next.js API routes
const shopify = shopifyApi({
  apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
  apiSecretKey: process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET,
  scopes: process.env.NEXT_PUBLIC_SHOPIFY_API_SCOPES?.split(","),
  apiVersion: ApiVersion.January25,
  hostName: process.env.NEXT_PUBLIC_HOST.replace(/^https?:\/\//, ""), // ✅ Removes "https://"
  hostScheme: "https",
  isEmbeddedApp: false,
});
export default shopify;

