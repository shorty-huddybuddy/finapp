"use client";
import { PageTransition } from "@/components/page-transition";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import React from "react";
import { Toaster } from "sonner";
import { SWRConfig } from 'swr'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (reduced to 100ms for faster navigation)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Toaster position="top-center" />
          <SWRConfig 
            value={{
              errorRetryCount: 2,
              shouldRetryOnError: false,
              revalidateOnFocus: false,
              revalidateOnReconnect: false,
              dedupingInterval: 300000, // 5 minutes
              focusThrottleInterval: 300000, // 5 minutes
              provider: () => new Map(), // Add a cache provider
            }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loader"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="fixed inset-0 flex items-center justify-center bg-white z-50"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: [0.8, 1.2, 1], 
                      opacity: 1,
                    }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div 
                      animate={{ 
                        rotateY: [0, 360],
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear"
                      }}
                      className="w-16 h-16 mb-4 text-blue-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3v18h18"></path>
                        <path d="M18.4 9.4l-4.2 4.2-2.3-2.3-4.2 4.2"></path>
                      </svg>
                    </motion.div>
                    <motion.p 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-lg font-semibold text-blue-600"
                    >
                      FinanceHub
                    </motion.p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PageTransition>{children}</PageTransition>
                </motion.div>
              )}
            </AnimatePresence>
          </SWRConfig>
        </body>
      </html>
    </ClerkProvider>
  );
}