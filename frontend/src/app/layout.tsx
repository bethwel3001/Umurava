import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import Sidebar from "@/components/layout/Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ["400", "500", "600", "700"], 
  subsets: ["latin"], 
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "UMU AI - Talent Screening",
  description: "AI-powered talent profile screening tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200`}>
        <StoreProvider>
          <div className="relative flex h-screen overflow-hidden">
            <Sidebar />
            
            <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
              <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between px-6 md:px-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 lg:hidden" /> 
                  <h2 className="text-lg font-bold text-primary dark:text-primary-hover">
                    Recruiter console
                  </h2>
                </div>
                
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                </div>
              </header>
              
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar">
                <div className="mx-auto max-w-6xl w-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
