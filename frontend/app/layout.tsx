import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayush · Portfolio",
  description: "Personal portfolio — product-minded engineer.",
  openGraph: {
    title: "Ayush · Portfolio",
    description: "Personal portfolio — product-minded engineer.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased selection:bg-[#0095f6]/25 selection:text-[var(--ig-text)]">
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{var t=localStorage.getItem("ayush-portfolio-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.setAttribute("data-theme",window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}}catch(e){}})()`,
          }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
