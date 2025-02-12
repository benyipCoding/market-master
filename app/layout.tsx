import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import StoreProvider from "@/providers/StoreProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import EmitteryProvider from "@/providers/EmitteryProvider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/context/Auth";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Market Master",
  description: "Train your investment skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          // enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <EmitteryProvider>
              <AuthProvider>{children}</AuthProvider>
            </EmitteryProvider>
          </StoreProvider>
        </ThemeProvider>
        <Toaster position="top-right" duration={2000} />
      </body>
    </html>
  );
}
