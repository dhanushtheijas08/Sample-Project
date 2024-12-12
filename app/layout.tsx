import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "@/context/QueryClientProvider";

export const metadata: Metadata = {
  title: "Wefaa Portal",
  description: "",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <Providers>{children}</Providers>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
