import type { Metadata } from "next";
import "./globals.css";
import UIProvider from "@/providers/UIProvider";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutProvider from "@/providers/LayoutProvider";

export const metadata: Metadata = {
  title: "ECommerce",
  description: "ECommerce website built with Next.js and Clerk", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorText: "#fff",
          colorPrimary: "#0E78F9",
          colorBackground: "#000",
          colorInputBackground: "#252A41",
          colorInputText: "#fff",
        },
      }}
    >
      <html lang="en">
        <head>
          {" "}
          <link
            href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
            rel="stylesheet"
          ></link>
        </head>
        <body>
          <UIProvider>
            <LayoutProvider>
              {children}
            </LayoutProvider>
          </UIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
