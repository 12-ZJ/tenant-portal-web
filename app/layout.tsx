import type { Metadata } from "next";
import "./globals.css";
import { prompt } from "./styles/font";
import ClientLayout from "./layout/client-layout";

export const metadata: Metadata = {
  title: "Tenant Portal",
  description: "Tenant Portal Backoffice",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${prompt.className} antialiased w-max`}>
          <ClientLayout>
            {children}
          </ClientLayout>
      </body>
    </html>
  );
}
