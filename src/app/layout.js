import "@/app/styles/globals.css";
import { CookiesProvider } from 'next-client-cookies/server';
import LayoutWrapper from "@/app/components/LayoutWrapper"; // Import the wrapper

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CookiesProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </CookiesProvider>
      </body>
    </html>
  );
}
