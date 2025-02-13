// src\app\pages\_app.js
import Layout from "../src/app/components/Layout";
import "@/app/styles/globals.css";
export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
