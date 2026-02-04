import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Todo App - Manage Your Tasks Efficiently",
    template: "%s | Todo App"
  },
  description: "Boost your productivity with our intuitive todo application. Manage tasks, track progress, and stay organized.",
  keywords: ["todo", "productivity", "task management", "organizer"],
  authors: [{ name: "Todo App Team" }],
  creator: "Todo App Team",
  publisher: "Todo App Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://todo-app.example.com",
    title: "Todo App - Manage Your Tasks Efficiently",
    description: "Boost your productivity with our intuitive todo application. Manage tasks, track progress, and stay organized.",
    siteName: "Todo App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todo App - Manage Your Tasks Efficiently",
    description: "Boost your productivity with our intuitive todo application. Manage tasks, track progress, and stay organized.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
