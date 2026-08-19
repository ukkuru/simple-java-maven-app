import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { AuthSessionProvider } from "@/components/auth/session-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://qpulse.sbs"),
  title: "User Story Quality Analyzer",
  description:
    "Analyze User Stories and Acceptance Criteria against SMART or INVEST and get actionable, AI-powered recommendations.",
  openGraph: {
    siteName: "QPulse",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "QPulse user story quality score" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <AuthSessionProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
