import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MoneyBoard",
  description: "Advanced Financial Analytics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster 
          theme="dark" 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-glass)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--color-glass-border)',
              color: 'white',
            }
          }}
        />
      </body>
    </html>
  );
}
