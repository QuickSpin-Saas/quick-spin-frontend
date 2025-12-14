import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { ReduxProvider } from "@/lib/redux/Provider";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { SkipToContent } from "@/components/ui/accessibility";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  keywords: ["microservices", "redis", "rabbitmq", "elasticsearch", "kubernetes", "managed services"],
  authors: [{ name: "QuickSpin Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: `${APP_NAME} - ${APP_DESCRIPTION}`,
    description: APP_DESCRIPTION,
    type: "website",
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ReduxProvider>
            <AuthSessionProvider>
              <SkipToContent />
              <div id="main-content" tabIndex={-1}>
                {children}
              </div>
              <Toaster />
            </AuthSessionProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}