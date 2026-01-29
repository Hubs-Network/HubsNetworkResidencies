import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ToastContainer } from "@/components/ui/Toast";
import { ClientInitializer } from "@/components/ClientInitializer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hubs Network - Residencies Platform",
  description: "Interactive prototype for Hubs Network residencies platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <ClientInitializer />
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
