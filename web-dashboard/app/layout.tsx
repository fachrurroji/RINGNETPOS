import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "RingPOS Dashboard",
    description: "SaaS POS Management Dashboard — Kelola bengkel Anda lebih efisien",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <body className="font-sans antialiased">{children}</body>
        </html>
    );
}
